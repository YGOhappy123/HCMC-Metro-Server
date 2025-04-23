import { Request, Response, NextFunction } from 'express'
import { ISearchParams } from '@/interfaces/params'
import tripService from '@/services/tripService'

const tripController = {
    getTrips: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { trips, total } = await tripService.getTrips({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: trips, total, took: trips.length })
        } catch (error) {
            next(error)
        }
    }
}

export default tripController
