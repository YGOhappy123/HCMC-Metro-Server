import { updateCustomerValidation } from '@/validations/userValidation'
import express from 'express'
import customerController from '@/controllers/customerController'
import verifyRoles from '@/middlewares/verifyRoles'
import { UserRole } from '@/enums/auth'

const router = express.Router()

router.patch('/update-info', verifyRoles([UserRole.CUSTOMER]), updateCustomerValidation, customerController.updateCustomer)

export default router
