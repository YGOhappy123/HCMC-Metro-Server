import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { HttpException } from '@/errors/HttpException'
import { RequestWithAuthData } from '@/interfaces/auth'
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
    },

    forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { email } = req.body
            await authService.forgotPassword(email)

            res.status(200).json({
                message: successMessage.RESET_PASSWORD_EMAIL_SENT
            })
        } catch (error) {
            next(error)
        }
    },

    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { token, password } = req.body
            await authService.resetPassword(token, password)

            res.status(200).json({
                message: successMessage.RESET_PASSWORD_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    },

    changePassword: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId, role } = req.auth!
            const { oldPassword, newPassword } = req.body
            await authService.changePassword(oldPassword, newPassword, userId, role)

            res.status(200).json({
                message: successMessage.CHANGE_PASSWORD_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    },

    loginByGoogleAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { googleAccessToken } = req.body
            const result = await authService.loginByGoogleAccount(googleAccessToken)

            res.status(200).json({
                data: result,
                message: successMessage.GOOGLE_AUTH_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    }
}

export default authController
