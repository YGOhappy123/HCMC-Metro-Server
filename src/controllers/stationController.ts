import { Request, Response, NextFunction } from 'express'
import { ISearchParams } from '@/interfaces/params'
import stationServices from '@/services/stationServices'

const stationController = {
    getStations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query
            const { stations, total } = await stationServices.getStations({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: stations, total, took: stations.length })
        } catch (error) {
            next(error)
        }
    }
}

export default stationController
