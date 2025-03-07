import { Request } from 'express'
import { UserRole } from '@/models/Account'

export interface RequestWithAuthData extends Request {
    auth?: AuthJwtPayload
}

export interface AuthJwtPayload {
    userId: number
    role: UserRole
}
