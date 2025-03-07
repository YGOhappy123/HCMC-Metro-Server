import { Response, NextFunction } from 'express'
import { HttpException } from '@/errors/HttpException'
import { verifyAccessToken } from '@/utils/jwtHelpers'
import { AuthJwtPayload, RequestWithAuthData } from '@/interfaces/auth'
import errorMessage from '@/configs/errorMessage'

const verifyLogin = (req: RequestWithAuthData, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            throw new HttpException(401, errorMessage.NO_CREDENTIALS)
        }

        const token = authHeader.split(' ')[1]
        const decodedToken = verifyAccessToken(token) as AuthJwtPayload

        req.auth = decodedToken
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyLogin
