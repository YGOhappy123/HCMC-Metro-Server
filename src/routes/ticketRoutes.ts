import { UserRole } from '@/enums/auth'
import { checkInCheckOutValidation, sellSingleJourneyValidation, sellSubscriptionValidation } from '@/validations/ticketValidations'
import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import ticketController from '@/controllers/ticketController'

const router = express.Router()

router.get('/public-subscription', ticketController.getPublicSubscriptionTickets)
router.get('/subscription', verifyRoles([UserRole.ADMIN]), ticketController.getSubscriptionTickets)
router.post('/sell-single-journey', verifyRoles([UserRole.STAFF]), sellSingleJourneyValidation, ticketController.sellSingleJourneyTicket)
router.post('/sell-subscription', verifyRoles([UserRole.STAFF]), sellSubscriptionValidation, ticketController.sellSubscriptionTicket)

router.post('/demo-check-in', checkInCheckOutValidation, ticketController.demoCheckIn)
router.post('/demo-check-out', checkInCheckOutValidation, ticketController.demoCheckOut)

export default router
