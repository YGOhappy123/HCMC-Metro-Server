import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import { UserRole } from '@/enums/auth'
import issuedTicketController from '@/controllers/issuedTicketController'

const router = express.Router()

router.get('/single-journey', verifyRoles([UserRole.ADMIN, UserRole.STAFF]), issuedTicketController.getSingleJourneyTickets)
router.get('/subscription', verifyRoles([UserRole.ADMIN, UserRole.STAFF]), issuedTicketController.getSubscriptionTickets)

export default router
