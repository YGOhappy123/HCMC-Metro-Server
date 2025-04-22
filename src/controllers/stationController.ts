import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import { PaymentMethod } from '@/enums/ticket'
import errorMessage from '@/configs/errorMessage'
import stationService from '@/services/stationService'

const stationController = {
    getLines: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { lines, total } = await stationService.getLines({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: lines, total, took: lines.length })
        } catch (error) {
            next(error)
        }
    },

    getStations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { stations, total } = await stationService.getStations({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
            } as ISearchParams)

            res.status(200).json({ data: stations, total, took: stations.length })
        } catch (error) {
            next(error)
        }
    },
    searchStations: async (req: Request, res: Response, next: NextFunction) => {
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
    },

    getPathBetweenStations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { start, end, method } = req.query
            const path = await stationService.getPathBetweenStations(
                Number.parseInt(start as string),
                Number.parseInt(end as string),
                method as PaymentMethod
            )

            res.status(200).json({ data: path })
        } catch (error) {
            next(error)
        }
    },

    getEnrichedPathBetweenStations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                console.log(errors)
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { start, end, method } = req.query
            const path = await stationService.getPathBetweenStations(
                Number.parseInt(start as string),
                Number.parseInt(end as string),
                method as PaymentMethod
            )

            const data = await stationService.getPathBetweenStationsWithStationName(path)

            res.status(200).json({ data })
        } catch (error) {
            next(error)
        }
    }
}

export default stationController
