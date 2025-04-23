import { Request, Response, NextFunction } from 'express'
import { ISearchParams } from '@/interfaces/params'
import issuedTicketService from '@/services/issuedTicketService'

const issuedTicketController = {
    getSingleJourneyTickets: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { tickets, total } = await issuedTicketService.getSingleJourneyTickets({
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

    createOrderSubscription: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { paymentMethod, paymentTime, totalAmount } = req.body;
    
            if (!paymentMethod || !paymentTime || !totalAmount) {
                res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
            }
    
            const orderId = Date.now();
    
            res.status(201).json({ message: 'Đơn hàng đã được tạo', data: { orderId } });
        } catch (error) {
            next(error);
        }
    },

    getSubscriptionTickets: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { tickets, total } = await issuedTicketService.getSubscriptionTickets({
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
