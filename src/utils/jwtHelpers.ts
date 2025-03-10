import { UserRole } from '@/models/Account'
import { HttpException } from '@/errors/HttpException'
import jwt, { JwtPayload } from 'jsonwebtoken'
import errorMessage from '@/configs/errorMessage'

const ACCESS_TOKEN_LIFE = '1h'
const REFRESH_TOKEN_LIFE = '7d'
const RESET_PASSWORD_TOKEN_LIFE = '10m'

export const generateAccessToken = ({ userId, role }: { userId: number; role: UserRole }) => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: ACCESS_TOKEN_LIFE
    })
}

export const generateRefreshToken = ({ accountId }: { accountId: number }) => {
    return jwt.sign({ accountId }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: REFRESH_TOKEN_LIFE
    })
}

export const generateResetPasswordToken = ({ email, type = 'forgot' }: { email: string; type: 'forgot' | 'google' }) => {
    if (type === 'google') {
        return jwt.sign({ email }, process.env.RESET_PASSWORD_TOKEN_SECRET!)
    }

    return jwt.sign({ email }, process.env.RESET_PASSWORD_TOKEN_SECRET!, {
        expiresIn: RESET_PASSWORD_TOKEN_LIFE
    })
}

export const verifyAccessToken = (accessToken: string) => {
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
        return decodedToken as JwtPayload
    } catch (error) {
        throw new HttpException(401, errorMessage.INVALID_TOKEN)
    }
}

export const verifyRefreshToken = (refreshToken: string) => {
    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        return decodedToken as JwtPayload
    } catch (error) {
        throw new HttpException(401, errorMessage.INVALID_TOKEN)
    }
}

export const verifyResetPasswordToken = (resetPasswordToken: string) => {
    try {
        const decodedToken = jwt.verify(resetPasswordToken, process.env.RESET_PASSWORD_TOKEN_SECRET!)
        return decodedToken as JwtPayload
    } catch (error) {
        throw new HttpException(401, errorMessage.INVALID_TOKEN)
    }
}
