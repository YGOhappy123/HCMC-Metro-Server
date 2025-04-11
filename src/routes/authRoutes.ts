import {
    changePasswordValidation,
    forgotPasswordValidation,
    googleAuthValidation,
    loginValidation,
    refreshTokenValidation,
    registerValidation,
    resetPasswordValidation
} from '@/validations/authValidations'
import express from 'express'
import authController from '@/controllers/authController'
import verifyLogin from '@/middlewares/verifyLogin'

const router = express.Router()

router.post('/login', loginValidation, authController.loginWithUsername)
router.post('/register', registerValidation, authController.registerCustomerAccount)
router.post('/refresh-token', refreshTokenValidation, authController.refreshToken)
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword)
router.post('/reset-password', resetPasswordValidation, authController.resetPassword)
router.post('/google-auth', googleAuthValidation, authController.loginByGoogleAccount)
router.post('/change-password', verifyLogin, changePasswordValidation, authController.changePassword)

export default router
