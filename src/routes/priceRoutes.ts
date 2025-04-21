import { UserRole } from '@/enums/auth'
import { updateSingleJourneyPriceValidation } from '@/validations/ticketValidations'
import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import priceController from '@/controllers/priceController'

const router = express.Router()

router.get('/single-journey', verifyRoles([UserRole.ADMIN]), priceController.getSingleJourneyPrice)
router.patch('/single-journey', verifyRoles([UserRole.ADMIN]), updateSingleJourneyPriceValidation, priceController.updateSingleJourneyPrice)

export default router
