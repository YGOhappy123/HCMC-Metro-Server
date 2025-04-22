import { query } from 'express-validator'

export const getStatisticValidation = [query('type').notEmpty().isIn(['daily', 'weekly', 'monthly', 'yearly'])]
