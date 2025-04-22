import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { StatisticType } from '@/interfaces/params'
import errorMessage from '@/configs/errorMessage'
import statisticService from '@/services/statisticService'

const statisticController = {
    getSummaryStatistic: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { type } = req.query
            const result = await statisticService.getSummaryStatistic(type as StatisticType)

            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    },

    getPopularStatistic: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { type } = req.query
            const result = await statisticService.getPopularStatistic(type as StatisticType)

            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    },

    getRevenuesChart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { type } = req.query
            const result = await statisticService.getRevenuesChart(type as StatisticType)

            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    },

    getOriginsChart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { type } = req.query
            const result = await statisticService.getOriginsChart(type as StatisticType)

            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    }
}

export default statisticController
