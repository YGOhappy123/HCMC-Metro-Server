import { UserRole } from '@/enums/auth'
import { getStatisticValidation } from '@/validations/statisticValidations'
import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import statisticController from '@/controllers/statisticController'

const router = express.Router()

router.get('/', verifyRoles([UserRole.ADMIN]), getStatisticValidation, statisticController.getSummaryStatistic)
router.get('/popular', verifyRoles([UserRole.ADMIN]), getStatisticValidation, statisticController.getPopularStatistic)
router.get('/revenue-chart', verifyRoles([UserRole.ADMIN]), getStatisticValidation, statisticController.getRevenuesChart)
router.get('/origin-chart', verifyRoles([UserRole.ADMIN]), getStatisticValidation, statisticController.getOriginsChart)

export default router
