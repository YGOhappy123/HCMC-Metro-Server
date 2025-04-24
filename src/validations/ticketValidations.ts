import { PaymentMethod } from '@/enums/ticket'
import { query, body } from 'express-validator'

export const getPathValidation = [
    query('start').notEmpty().isInt({ min: 1 }),
    query('end').notEmpty().isInt({ min: 1 }),
    query('method').optional().isIn(Object.values(PaymentMethod))
]

export const buySingleJourneyValidation = [
    body('start').notEmpty().isInt({ min: 1 }),
    body('end').notEmpty().isInt({ min: 1 }),
    body('quantity').notEmpty().isInt({ min: 1 })
]

export const sellSingleJourneyValidation = [
    body('start').notEmpty().isInt({ min: 1 }),
    body('end').notEmpty().isInt({ min: 1 }),
    body('quantity').notEmpty().isInt({ min: 1 }),
    body('method').notEmpty().isIn(Object.values(PaymentMethod))
]

export const buySubscriptionValidation = [body('ticketId').notEmpty().isInt({ min: 1 }), body('quantity').notEmpty().isInt({ min: 1 })]

export const sellSubscriptionValidation = [
    body('ticketId').notEmpty().isInt({ min: 1 }),
    body('quantity').notEmpty().isInt({ min: 1 }),
    body('method').notEmpty().isIn(Object.values(PaymentMethod))
]

export const verifyPaymentValidation = [
    query('vnp_TxnRef').notEmpty().isInt({ min: 1 }),
    query('vnp_ResponseCode').notEmpty().isString().isNumeric(),
    query('paymentMethod').isString()
]

export const updateSingleJourneyPriceValidation = [
    body('first').notEmpty().isInt({ min: 1 }),
    body('second').notEmpty().isInt({ min: 1 }),
    body('price').notEmpty().isInt({ min: 1 }),
    body('method').isString()
]

export const updateSubscriptionPriceValidation = [body('ticketId').notEmpty().isInt({ min: 1 }), body('price').notEmpty().isInt({ min: 1 })]

export const checkInCheckOutValidation = [
    body('code').notEmpty().isString().isLength({ min: 16, max: 16 }),
    body('station').notEmpty().isInt({ min: 1 })
]
