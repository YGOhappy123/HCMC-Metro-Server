import { body } from 'express-validator'

const JWT_REGEX_PATTERN = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
const GOOGLE_TOKEN_REGEX_PATTERN = /^ya29\.[0-9A-Za-z\-_]+$/

export const loginValidation = [body('username').trim().isString().notEmpty(), body('password').trim().isString().notEmpty()]

export const registerValidation = [
    body('fullName').trim().isString().isLength({ min: 2, max: 50 }),
    body('username').trim().isString().isLength({ min: 8, max: 20 }),
    body('password').trim().isString().isLength({ min: 8, max: 20 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    })
]

export const refreshTokenValidation = [body('refreshToken').matches(JWT_REGEX_PATTERN)]

export const forgotPasswordValidation = [body('email').isEmail()]

export const resetPasswordValidation = [
    body('token').matches(JWT_REGEX_PATTERN),
    body('password').trim().isString().isLength({ min: 8, max: 20 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    })
]

export const changePasswordValidation = [
    body('oldPassword').trim().isString(),
    body('newPassword').trim().isString().isLength({ min: 8, max: 20 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match')
        }
        return true
    })
]

export const googleAuthValidation = [body('googleAccessToken').trim().matches(GOOGLE_TOKEN_REGEX_PATTERN)]
