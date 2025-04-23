import { body } from 'express-validator'

export const updateCustomerValidation = [
    body('fullName').trim().optional().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().optional().isEmail(),
    body('phoneNumber').trim().optional().isMobilePhone('vi-VN'),
    body('avatar').trim().optional().isURL()
]

export const createStaffValidation = [
    body('fullName').trim().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().isEmail(),
    body('phoneNumber').trim().isMobilePhone('vi-VN'),
    body('hireDate').trim().isDate(),
    body('workingStationId').trim().isNumeric()
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

export const createAdminValidation = [
    body('fullName').trim().isString().isLength({ min: 2, max: 255 }),
    body('email').trim().isEmail(),
    body('phoneNumber').trim().isMobilePhone('vi-VN'),
  ];
  