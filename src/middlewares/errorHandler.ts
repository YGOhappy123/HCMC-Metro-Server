import { Request, Response, NextFunction } from 'express'
import { ValidationError } from 'sequelize'
import errorMessage from '@/configs/errorMessage'

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof ValidationError) {
            res.status(422).json({ message: errorMessage.DATA_VALIDATION_FAILED })
        }

        const status = error.status || error.statusCode || 500
        const message = error.message || errorMessage.INTERNAL_SERVER_ERROR

        res.status(status).json({ message: message })
    } catch (err) {
        next(err)
    }
}

export default errorHandler
