import { ISearchParams } from '@/interfaces/params'
import Line from '@/models/Line';
import LineStation from '@/models/LineStation';
import Station from '@/models/Station'
import { Op } from 'sequelize'

const stationServices = {
    getStations: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: stations } = await Station.findAndCountAll({
            limit: limit,
            offset: skip,
            where: buildWhereStatement(filter)
        });

        return {
            stations: stations.map(station => station.toJSON()),
            total: count
        }
    }

    // getStation_Line: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
    //         const { count, rows: line_station } = await LineStation.findAndCountAll({
    //             include: [Station, Line],
    //             where: buildWhereStatement(filter),
    //             limit: limit,
    //             offset: skip,
    //             order: JSON.parse(sort)
    //         })
    
    //         return {
    //             line_station: line_station.map(item => {
    //                 const line_station = item as LineStation & {
    //                     Station?: Station;
    //                     Line?: Line;
    //                 }
    //                 return {
    //                     stationName: line_station.Station?.stationName,
    //                     lineName: line_station.Line?.lineName,
    //                     ...
    //                 }

    //                 // const {st , line, ...line_stationData } = line_station.toJSON()
    //                 // return {
    //                 //     ...line_stationData,
    //                 //     stationName: station?.stationName
    //                 //     lineName: line?.
    //                 // }
    //             }),

                
    //             total: count
    //         }
    //     },
}

export default stationServices



export const buildWhereStatement = (filter: string = '{}') => {
    const parsedFilter = JSON.parse(filter)
    const whereStatement: any = {}

    for (const criteria in parsedFilter) {
        if (parsedFilter[criteria] != undefined) {
            switch (criteria) {
                case 'stationName':
                    whereStatement.stationName = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'location':
                    whereStatement.location = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'lines':
                    whereStatement.lines = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                default:
                    whereStatement[criteria] = parsedFilter[criteria]
                    break
            }
        }
    }

    return whereStatement
}