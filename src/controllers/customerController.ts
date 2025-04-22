import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestWithAuthData } from '@/interfaces/auth'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import customerService from '@/services/customerService'
import successMessage from '@/configs/successMessage'
import errorMessage from '@/configs/errorMessage'

const customerController = {
    getCustomers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { customers, total } = await customerService.getCustomers({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: customers, total, took: customers.length })
        } catch (error) {
            next(error)
        }
    },

    updateCustomer: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId } = req.auth!
            const { fullName, email, phoneNumber, avatar } = req.body

            await customerService.updateCustomer(userId, { fullName, email, phoneNumber, avatar })

            res.status(200).json({ message: successMessage.UPDATE_USER_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    deactivateCustomerAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params

            await customerService.deactivateCustomerAccount(Number.parseInt(customerId))

            res.status(200).json({ message: successMessage.DEACTIVATE_ACCOUNT_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    buySingleJourneyTicket: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errors.array().toString())
            }

            const { userId } = req.auth!
            const { start, end, quantity } = req.body
            const vnpayPaymentUrl = await customerService.buySingleJourneyTicket(userId, start, end, quantity)

            res.status(200).json({ data: { paymentUrl: vnpayPaymentUrl } })
        } catch (error) {
            next(error)
        }
    },

    verifyPayment: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.auth!
            const vnpParams = req.query

            await customerService.verifyPayment(userId, vnpParams)

            res.status(200).json({ message: successMessage.VERIFY_PAYMENT_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    }
}

export default customerController
