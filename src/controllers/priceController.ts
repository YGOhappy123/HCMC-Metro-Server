import { Request, Response, NextFunction } from 'express'
import { RequestWithAuthData } from '@/interfaces/auth'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import priceService from '@/services/priceService'
import errorMessage from '@/configs/errorMessage'
import successMessage from '@/configs/successMessage'

const priceController = {
    getSingleJourneyPrice: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { prices, total } = await priceService.getSingleJourneyPrice({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: prices, total, took: prices.length })
        } catch (error) {
            next(error)
        }
    },

    updateSingleJourneyPrice: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId } = req.auth!
            const { first, second, method, price } = req.body
            await priceService.updateSingleJourneyPrice(userId, first, second, method, price)

            res.status(200).json({ message: successMessage.UPDATE_PRICE_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    getSubscriptionPrice: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { prices, total } = await priceService.getSubscriptionPrice({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: prices, total, took: prices.length })
        } catch (error) {
            next(error)
        }
    },

    updateSubscriptionPrice: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId } = req.auth!
            const { ticketId, price } = req.body
            await priceService.updateSubscriptionPrice(userId, ticketId, price)

            res.status(200).json({ message: successMessage.UPDATE_PRICE_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    }
}

export default priceController
