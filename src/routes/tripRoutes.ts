import express from 'express'
import verifyRoles from '@/middlewares/verifyRoles'
import { UserRole } from '@/enums/auth'
import tripController from '@/controllers/tripController'

const router = express.Router()

router.get('/', verifyRoles([UserRole.ADMIN, UserRole.STAFF]), tripController.getTrips)

export default router
