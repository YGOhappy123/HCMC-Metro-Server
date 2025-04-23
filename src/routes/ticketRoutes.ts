import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import { UserRole } from '@/enums/auth'
import ticketController from '@/controllers/ticketController'

const router = express.Router()

router.get('/subscription', verifyRoles([UserRole.ADMIN]), ticketController.getSubscriptionTickets)
router.post('/ticket/issue-subscription-ticket', ticketController.issueSubscriptionTicket);

export default router
