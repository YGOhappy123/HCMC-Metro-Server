import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestWithAuthData } from '@/interfaces/auth'
import { HttpException } from '@/errors/HttpException'
import customerService from '@/services/customerService'
import successMessage from '@/configs/successMessage'
import errorMessage from '@/configs/errorMessage'

const customerController = {
    getCustomers: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query
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
    }
}

export default customerController
