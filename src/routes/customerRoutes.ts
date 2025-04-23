import { UserRole } from '@/enums/auth'
import { updateCustomerValidation } from '@/validations/userValidation'
import { verifyPaymentValidation, buySingleJourneyValidation, buySubscriptionValidation } from '@/validations/ticketValidations'
import express from 'express'
import customerController from '@/controllers/customerController'
import verifyRoles from '@/middlewares/verifyRoles'

const router = express.Router()

router.get('/', verifyRoles([UserRole.STAFF, UserRole.ADMIN]), customerController.getCustomers)
router.patch('/update-info', verifyRoles([UserRole.CUSTOMER]), updateCustomerValidation, customerController.updateCustomer)
router.post('/:customerId/deactivate-account', verifyRoles([UserRole.ADMIN]), customerController.deactivateCustomerAccount)
router.get('/tickets/verify-payment', verifyRoles([UserRole.CUSTOMER]), verifyPaymentValidation, customerController.verifyPayment)
router.get('/my-orders', verifyRoles([UserRole.CUSTOMER]), customerController.getCustomerOrders)
router.post('/tickets/single-journey', verifyRoles([UserRole.CUSTOMER]), buySingleJourneyValidation, customerController.buySingleJourneyTicket)
router.post('/tickets/subscription', verifyRoles([UserRole.CUSTOMER]), buySubscriptionValidation, customerController.buySubscriptionTicket)

export default router
