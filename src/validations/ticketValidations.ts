import { PaymentMethodIncludingSfc } from '@/enums/ticket'
import { query } from 'express-validator'

export const getPathValidation = [
    query('start').notEmpty().isInt({ min: 1 }),
    query('end').notEmpty().isInt({ min: 1 }),
    query('method').optional().isIn(Object.values(PaymentMethodIncludingSfc))
]
