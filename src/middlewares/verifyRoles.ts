import { Response, NextFunction } from 'express'
import { UserRole } from '@/models/Account'
import { HttpException } from '@/errors/HttpException'
import { verifyAccessToken } from '@/utils/jwtHelpers'
import { AuthJwtPayload, RequestWithAuthData } from '@/interfaces/auth'
import errorMessage from '@/configs/errorMessage'

const verifyRoles = (allowedRoles: UserRole[]) => {
    return (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization
            if (!authHeader?.startsWith('Bearer ')) {
                throw new HttpException(401, errorMessage.NO_CREDENTIALS)
            }

            const token = authHeader.split(' ')[1]
            const decodedToken = verifyAccessToken(token) as AuthJwtPayload

            if (!allowedRoles.includes(decodedToken.role)) {
                throw new HttpException(403, errorMessage.FORBIDDEN)
            }

            req.auth = decodedToken
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default verifyRoles
