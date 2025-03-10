import { loginValidation, refreshTokenValidation, registerValidation } from '@/validations/authValidations'
import express from 'express'
import authController from '@/controllers/authController'

const router = express.Router()

router.post('/login', loginValidation, authController.loginWithUsername)
router.post('/register', registerValidation, authController.registerCustomerAccount)
router.post('/refresh-token', refreshTokenValidation, authController.refreshToken)
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password', authController.resetPassword)
// router.post(
//     '/deactivate/:customerId',
//     verifyRole.specificRolesOnly(['User', 'Admin']),
//     authController.deactivateCustomerAccount
// )
// router.post('/google-auth', authController.loginByGoogleAccount)
// router.post('/change-password', verifyRole.loginRequired, authController.changePassword)

export default router
