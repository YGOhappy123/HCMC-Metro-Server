import { ISearchParams } from '@/interfaces/params'
import Station from '@/models/Station'

const stationServices = {
    getStations: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: stations } = await Station.findAndCountAll()

        return {
            stations: stations.map(station => station.toJSON()),
            total: count
        }
    }
}

export default stationServices
