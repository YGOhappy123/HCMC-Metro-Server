import { UserRole } from '@/enums/auth'
import { createAdminValidation, updateAdminValidation, createStaffValidation, updateStaffValidation } from '@/validations/userValidation'
import verifyRoles from '@/middlewares/verifyRoles'
import personnelController from '@/controllers/personnelController'
import express from 'express'

const router = express.Router()

router.get('/staffs', verifyRoles([UserRole.ADMIN]), personnelController.getStaffs)
router.post('/staffs', verifyRoles([UserRole.ADMIN]), createStaffValidation, personnelController.createNewStaff)
router.patch('/staffs/:staffId/update-info', verifyRoles([UserRole.STAFF, UserRole.ADMIN]), updateStaffValidation, personnelController.updateStaff)
router.post('/staffs/:staffId/deactivate-account', verifyRoles([UserRole.ADMIN]), personnelController.deactivateStaffAccount)

router.get('/admins', verifyRoles([UserRole.ADMIN]), personnelController.getAdmins)
router.post('/admins', verifyRoles([UserRole.ADMIN]), createAdminValidation, personnelController.createNewAdmin)
router.patch('/admins/update-info', verifyRoles([UserRole.ADMIN]), updateAdminValidation, personnelController.updateAdmin)
router.post('/admins/:adminId/deactivate-account', verifyRoles([UserRole.ADMIN]), personnelController.deactivateAdminAccount)

export default router
