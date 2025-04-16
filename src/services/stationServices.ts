import { PaymentMethodIncludingSfc } from '@/enums/ticket'
import { ISearchParams } from '@/interfaces/params'
import Line from '@/models/Line'
import SingleJourneyTicketPrice from '@/models/SingleJourneyTicketPrice'
import Station from '@/models/Station'
import { Op } from 'sequelize'

const stationServices = {
    getStations: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: stations } = await Station.findAndCountAll()

        return {
            stations: stations.map(station => station.toJSON()),
            total: count
        }
    },

    getPathBetweenStations: async (
        startStationId: number,
        endStationId: number,
        paymentMethod: PaymentMethodIncludingSfc | undefined = PaymentMethodIncludingSfc.CASH
    ) => {
        if (startStationId === endStationId) return []

        const buildLineMap = async () => {
            const lineMap: { [lineName: string]: number[] } = {}
            const lineWithStations = await Line.findAll({ include: [Station] })

            lineWithStations.forEach(line => {
                const sortedStations = [...line.stations].sort((a: any, b: any) => a.LineStation.position - b.LineStation.position)
                lineMap[line.lineName] = sortedStations.map(station => station.stationId)
            })
            return lineMap
        }

        const buildGraph = (lineMap: { [lineName: string]: number[] }) => {
            const graph: { [station: number]: Set<number> } = {}

            for (const line of Object.values(lineMap)) {
                for (let i = 0; i < line.length; i++) {
                    if (!graph[line[i]]) graph[line[i]] = new Set()
                    if (i > 0) graph[line[i]].add(line[i - 1])
                    if (i < line.length - 1) graph[line[i]].add(line[i + 1])
                }
            }
            return graph
        }

        const getCommonLine = (lineMap: { [lineName: string]: number[] }, a: number, b: number) => {
            for (const [line, stations] of Object.entries(lineMap)) {
                if (stations.includes(a) && stations.includes(b)) return line
            }
            return null
        }

        const getPath = (lineMap: { [lineName: string]: number[] }, start: number, end: number) => {
            const graph = buildGraph(lineMap)
            const visited = new Set<number>()
            const queue = [start]
            const parent: { [station: number]: number } = {}

            // BFS to find traverse the graph
            visited.add(start)

            while (queue.length > 0) {
                const current = queue.shift()!
                if (current === end) break

                for (const neighbor of graph[current]) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor)
                        queue.push(neighbor)
                        parent[neighbor] = current
                    }
                }
            }

            // Reconstruct path from end to start
            if (!visited.has(end)) return []

            const path = [end]
            let current = end
            while (current !== start) {
                current = parent[current]
                path.unshift(current)
            }

            // Group segments by line
            const result: { from: number; to: number; line: string }[] = []
            let groupStart = path[0]
            let currentLine = getCommonLine(lineMap, path[0], path[1])

            for (let i = 1; i < path.length; i++) {
                const line = getCommonLine(lineMap, path[i - 1], path[i])
                if (line !== currentLine) {
                    result.push({ from: groupStart, to: path[i - 1], line: currentLine! })
                    groupStart = path[i - 1]
                    currentLine = line
                }
            }

            result.push({ from: groupStart, to: path[path.length - 1], line: currentLine! })
            return result
        }

        const lineMap = await buildLineMap()
        const pathBetweenStations = getPath(lineMap, startStationId, endStationId)
        const result = await Promise.all(
            pathBetweenStations.map(async path => {
                const ticketPrice = await SingleJourneyTicketPrice.findOne({
                    where: {
                        [Op.and]: [
                            { paymentMethod: paymentMethod },
                            {
                                [Op.or]: [
                                    { firstStationId: path.from, secondStationId: path.to },
                                    { firstStationId: path.to, secondStationId: path.from }
                                ]
                            }
                        ]
                    },
                    order: [['updatedAt', 'DESC']]
                })

                return { ...path, price: ticketPrice?.price ?? 0 }
            })
        )

        return result
    }
}

export default stationServices
