import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import successMessage from '@/configs/successMessage'
import errorMessage from '@/configs/errorMessage'
import authService from '@/services/authService'

const authController = {
    loginWithUsername: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { username, password } = req.body
            const result = await authService.loginWithUsername(username, password)

            res.status(200).json({
                data: result,
                message: successMessage.LOGIN_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    },

    registerCustomerAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { username, password, fullName } = req.body
            const result = await authService.registerCustomerAccount(username, password, fullName)

            res.status(200).json({
                data: result,
                message: successMessage.REGISTER_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    },

    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { refreshToken } = req.body
            const result = await authService.refreshToken(refreshToken)

            res.status(200).json({
                data: result,
                message: successMessage.REFRESH_TOKEN_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    }
}

export default authController
