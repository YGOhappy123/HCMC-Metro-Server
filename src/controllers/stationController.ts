import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import { PaymentMethodIncludingSfc } from '@/enums/ticket'
import errorMessage from '@/configs/errorMessage'
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
    },

    getPathBetweenStations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { start, end, method } = req.query
            const path = await stationServices.getPathBetweenStations(
                Number.parseInt(start as string),
                Number.parseInt(end as string),
                method as PaymentMethodIncludingSfc
            )

            res.status(200).json({ data: path })
        } catch (error) {
            next(error)
        }
    }
}

export default stationController
