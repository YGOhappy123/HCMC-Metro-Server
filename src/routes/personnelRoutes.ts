import { UserRole } from '@/enums/auth'
import { updateAdminValidation, createStaffValidation, updateStaffValidation } from '@/validations/userValidation'
import verifyRoles from '@/middlewares/verifyRoles'
import personnelController from '@/controllers/personnelController'
import express from 'express'

const router = express.Router()

router.get('/staffs', verifyRoles([UserRole.ADMIN]), personnelController.getStaffs)
router.post('/staffs', verifyRoles([UserRole.ADMIN]), createStaffValidation, personnelController.createNewStaff)
router.patch('/staffs/:staffId/update-info', verifyRoles([UserRole.STAFF, UserRole.ADMIN]), updateStaffValidation, personnelController.updateStaff)
router.post('/staffs/:staffId/deactivate-account', verifyRoles([UserRole.ADMIN]), personnelController.deactivateStaffAccount)

router.patch('/admins/update-info', verifyRoles([UserRole.ADMIN]), updateAdminValidation, personnelController.updateAdmin)

export default router
