import { UserRole } from '@/enums/auth'
import { updateAdminValidation, updateStaffValidation } from '@/validations/userValidation'
import verifyRoles from '@/middlewares/verifyRoles'
import personnelController from '@/controllers/personnelController'
import express from 'express'

const router = express.Router()

router.patch('/staffs/:staffId/update-info', verifyRoles([UserRole.STAFF, UserRole.ADMIN]), updateStaffValidation, personnelController.updateStaff)
router.patch('/admins/update-info', verifyRoles([UserRole.ADMIN]), updateAdminValidation, personnelController.updateAdmin)

export default router
