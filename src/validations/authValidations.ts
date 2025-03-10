import { body } from 'express-validator'

export const loginValidation = [body('username').trim().isString().notEmpty(), body('password').trim().isString().notEmpty()]

export const registerValidation = [
    body('username').trim().isString().isLength({ min: 8, max: 20 }),
    body('password').trim().isString().isLength({ min: 8, max: 20 }),
    body('fullName').trim().isString().isLength({ min: 2, max: 50 })
]

export const refreshTokenValidation = [
    body('refreshToken')
        .trim()
        .matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
]
