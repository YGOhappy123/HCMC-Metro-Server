import { UserRole } from '@/enums/auth'
import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import ticketController from '@/controllers/ticketController'

const router = express.Router()

router.get('/public-subscription', ticketController.getPublicSubscriptionTickets)
router.get('/subscription', verifyRoles([UserRole.ADMIN]), ticketController.getSubscriptionTickets)

export default router
