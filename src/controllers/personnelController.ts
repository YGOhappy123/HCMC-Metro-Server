import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestWithAuthData } from '@/interfaces/auth'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import personnelService from '@/services/personnelService'
import successMessage from '@/configs/successMessage'
import errorMessage from '@/configs/errorMessage'

const personnelController = {
    // STAFF LOGIC
    getStaffs: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query

            const { staffs, total } = await personnelService.getStaffs({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: staffs, total, took: staffs.length })
        } catch (error) {
            next(error)
        }
    },

    createNewStaff: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId } = req.auth!
            const { fullName, email, phoneNumber, hireDate, workingStationId } = req.body

            await personnelService.createNewStaff(fullName, email, phoneNumber, hireDate, workingStationId, userId)

            res.status(201).json({ message: successMessage.CREATE_STAFF_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    updateStaff: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { staffId } = req.params
            const { userId, role } = req.auth!
            const { fullName, email, phoneNumber, avatar, workingStationId } = req.body

            await personnelService.updateStaff(Number.parseInt(staffId), userId, role, { fullName, email, phoneNumber, avatar, workingStationId })

            res.status(200).json({ message: successMessage.UPDATE_USER_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    deactivateStaffAccount: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const { staffId } = req.params

            await personnelService.deactivateStaffAccount(Number.parseInt(staffId))

            res.status(200).json({ message: successMessage.DEACTIVATE_ACCOUNT_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    },

    // ADMIN LOGIC
    updateAdmin: async (req: RequestWithAuthData, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const { userId } = req.auth!
            const { fullName, email, phoneNumber, avatar } = req.body

            await personnelService.updateAdmin(userId, { fullName, email, phoneNumber, avatar })

            res.status(200).json({ message: successMessage.UPDATE_USER_SUCCESSFULLY })
        } catch (error) {
            next(error)
        }
    }
}

export default personnelController
