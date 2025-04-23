import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import { UserRole } from '@/enums/auth'
import issuedTicketController from '@/controllers/issuedTicketController'

const router = express.Router()

router.get('/single-journey', verifyRoles([UserRole.ADMIN]), issuedTicketController.getSingleJourneyTickets)
router.get('/subscription', verifyRoles([UserRole.ADMIN]), issuedTicketController.getSubscriptionTickets)
router.post('/orders', issuedTicketController.createOrderSubscription);

export default router
