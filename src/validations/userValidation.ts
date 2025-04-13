import { body } from 'express-validator'

export const updateCustomerValidation = [
    body('fullName').trim().optional().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().optional().isEmail(),
    body('phoneNumber').trim().optional().isMobilePhone('vi-VN'),
    body('avatar').trim().optional().isURL()
]

export const updateStaffValidation = [
    body('fullName').trim().optional().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().optional().isEmail(),
    body('phoneNumber').trim().optional().isMobilePhone('vi-VN'),
    body('avatar').trim().optional().isURL(),
    body('workingStationId').trim().optional().isNumeric()
]

export const updateAdminValidation = [
    body('fullName').trim().optional().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().optional().isEmail(),
    body('phoneNumber').trim().optional().isMobilePhone('vi-VN'),
    body('avatar').trim().optional().isURL()
]
