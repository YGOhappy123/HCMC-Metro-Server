import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestWithAuthData } from '@/interfaces/auth'
import { ISearchParams } from '@/interfaces/params'
import { HttpException } from '@/errors/HttpException'
import { PaymentMethod } from '@/enums/ticket'
import ticketService from '@/services/ticketService'
import errorMessage from '@/configs/errorMessage'
import successMessage from '@/configs/successMessage'

const issuedTicketController = {
    getPublicSubscriptionTickets: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tickets = await ticketService.getPublicSubscriptionTickets()

            res.status(200).json({ data: tickets })
        } catch (error) {
            next(error)
        }
    },

    getSubscriptionTickets: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { tickets, total } = await ticketService.getSubscriptionTickets({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: tickets, total, took: tickets.length })
        } catch (error) {
            next(error)
        }
    },

    sellSingleJourneyTicket: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errors.array().toString())
            }

            const { userId } = req.auth!
            const { start, end, quantity, method } = req.body
            await ticketService.sellSingleJourneyTicket(userId, start, end, quantity, method as PaymentMethod)

            res.status(200).json({ message: successMessage.SELL_TICKETS_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    sellSubscriptionTicket: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errors.array().toString())
            }

            const { userId } = req.auth!
            const { ticketId, quantity, method } = req.body
            await ticketService.sellSubscriptionTicket(userId, ticketId, quantity, method as PaymentMethod)

            res.status(200).json({ message: successMessage.SELL_TICKETS_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    demoCheckIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { code, station } = req.body
            await ticketService.demoCheckIn(code, station)

            res.status(200).json({ message: successMessage.CHECK_IN_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    demoCheckOut: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { code, station } = req.body
            await ticketService.demoCheckOut(code, station)

            res.status(200).json({ message: successMessage.CHECK_OUT_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    }
}

export default issuedTicketController
