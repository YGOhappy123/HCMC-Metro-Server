import { Request, Response, NextFunction } from 'express'
import { ISearchParams } from '@/interfaces/params'
import ticketService from '@/services/ticketService'

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
    }
}

export default issuedTicketController
