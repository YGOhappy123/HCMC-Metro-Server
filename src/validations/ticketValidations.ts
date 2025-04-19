import { PaymentMethodIncludingSfc } from '@/enums/ticket'
import { query, body } from 'express-validator'

export const getPathValidation = [
    query('start').notEmpty().isInt({ min: 1 }),
    query('end').notEmpty().isInt({ min: 1 }),
    query('method').optional().isIn(Object.values(PaymentMethodIncludingSfc))
]

export const buySingleJourneyValidation = [
    body('start').notEmpty().isInt({ min: 1 }),
    body('end').notEmpty().isInt({ min: 1 }),
    body('quantity').notEmpty().isInt({ min: 1 })
]

export const verifyPaymentValidation = [
    query('vnp_TxnRef').notEmpty().isInt({ min: 1 }),
    query('vnp_ResponseCode').notEmpty().isString().isNumeric(),
    query('paymentMethod').isString()
]
