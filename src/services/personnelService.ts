import { Op } from 'sequelize'
import { HttpException } from '@/errors/HttpException'
import { capitalizeWords, generateRandomString } from '@/utils/stringHelpers'
import { UserRole } from '@/enums/auth'
import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import Staff, { StaffAttributes } from '@/models/Staff'
import Admin, { AdminAttributes } from '@/models/Admin'
import Account from '@/models/Account'
import Station from '@/models/Station'
import errorMessage from '@/configs/errorMessage'
import mailerService from '@/services/mailerService'
import dayjs from 'dayjs'

const personnelService = {
    // STAFF LOGIC
    getStaffs: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: staffs } = await Staff.findAndCountAll({
            include: [Account, Admin, Station],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
        })

        return {
            staffs: staffs.map(staff => {
                const { account, accountId, ...staffData } = staff.toJSON()
                return {
                    ...staffData,
                    isActive: account?.isActive
                }
            }),
            total: count
        }
    },

    createNewStaff: async (fullName: string, email: string, phoneNumber: string, hireDate: string, workingStationId: number, adminId: number) => {
        const isEmailDuplicate = !!(await Staff.findOne({
            where: { email: email.trim() },
            include: [{ model: Account, where: { isActive: true } }]
        }))
        if (isEmailDuplicate) throw new HttpException(409, errorMessage.EMAIL_EXISTED)

        const isPhoneNumberDuplicate = !!(await Staff.findOne({
            where: { phoneNumber: phoneNumber.trim() },
            include: [{ model: Account, where: { isActive: true } }]
        }))
        if (isPhoneNumberDuplicate) throw new HttpException(409, errorMessage.PHONE_NUMBER_EXISTED)

        const stationInfo = await Station.findByPk(workingStationId)
        if (!stationInfo) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

        const randomUsername = generateRandomString()
        const randomPassword = generateRandomString()

        const newAccount = await Account.create({
            username: randomUsername,
            password: randomPassword,
            role: UserRole.STAFF
        })

        await Staff.create({
            fullName: capitalizeWords(fullName),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            avatar: process.env.SQL_DEFAULT_AVATAR_URL,
            hireDate: new Date(hireDate),
            workingStationId: workingStationId,
            createdBy: adminId,
            accountId: newAccount.accountId
        })

        mailerService.sendWelcomeNewStaffMail(
            email.trim(),
            capitalizeWords(fullName),
            dayjs(hireDate).format('DD/MM/YYYY'),
            `${stationInfo.stationName} (${stationInfo.location})`,
            randomUsername,
            randomPassword,
            `${process.env.CLIENT_URL}/profile/change-password`
        )
    },

    updateStaff: async (staffId: number, authUserId: number, authUserRole: UserRole, data: Partial<StaffAttributes>) => {
        if (authUserRole !== UserRole.ADMIN && staffId !== authUserId) throw new HttpException(403, errorMessage.NO_PERMISSION)

        const staff = await Staff.findOne({ where: { staffId: staffId }, include: [{ model: Account, where: { isActive: true } }] })
        if (!staff) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        const dataToUpdate: Partial<StaffAttributes> = {}

        if (data.fullName != undefined && authUserRole === UserRole.ADMIN) dataToUpdate.fullName = capitalizeWords(data.fullName)
        if (data.avatar != undefined) dataToUpdate.avatar = data.avatar.trim()
        if (data.workingStationId != undefined && authUserRole === UserRole.ADMIN) dataToUpdate.workingStationId = data.workingStationId

        if (data.email != undefined && authUserRole === UserRole.ADMIN) {
            const isEmailDuplicate = !!(await Staff.findOne({
                where: {
                    email: data.email.trim(),
                    staffId: { [Op.ne]: staffId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isEmailDuplicate) throw new HttpException(409, errorMessage.EMAIL_EXISTED)
            dataToUpdate.email = data.email.trim()
        }

        if (data.phoneNumber != undefined && authUserRole === UserRole.ADMIN) {
            const isPhoneNumberDuplicate = !!(await Staff.findOne({
                where: {
                    phoneNumber: data.phoneNumber.trim(),
                    staffId: { [Op.ne]: staffId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isPhoneNumberDuplicate) throw new HttpException(409, errorMessage.PHONE_NUMBER_EXISTED)
            dataToUpdate.phoneNumber = data.phoneNumber.trim()
        }

        await staff.update(dataToUpdate)
    },

    deactivateStaffAccount: async (staffId: number) => {
        const staff = await Staff.findOne({ where: { staffId: staffId }, include: [{ model: Account, where: { isActive: true } }] })
        if (!staff) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        await Account.update({ isActive: false }, { where: { accountId: staff.accountId } })
    },

    // ADMIN LOGIC
    updateAdmin: async (adminId: number, data: Partial<AdminAttributes>) => {
        const admin = await Admin.findOne({ where: { adminId: adminId }, include: [{ model: Account, where: { isActive: true } }] })
        if (!admin) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        const dataToUpdate: Partial<AdminAttributes> = {}

        if (data.fullName != undefined) dataToUpdate.fullName = capitalizeWords(data.fullName)
        if (data.avatar != undefined) dataToUpdate.avatar = data.avatar.trim()

        if (data.email != undefined) {
            const isEmailDuplicate = !!(await Admin.findOne({
                where: {
                    email: data.email.trim(),
                    adminId: { [Op.ne]: adminId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isEmailDuplicate) throw new HttpException(409, errorMessage.EMAIL_EXISTED)
            dataToUpdate.email = data.email.trim()
        }

        if (data.phoneNumber != undefined) {
            const isPhoneNumberDuplicate = !!(await Admin.findOne({
                where: {
                    phoneNumber: data.phoneNumber.trim(),
                    adminId: { [Op.ne]: adminId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isPhoneNumberDuplicate) throw new HttpException(409, errorMessage.PHONE_NUMBER_EXISTED)
            dataToUpdate.phoneNumber = data.phoneNumber.trim()
        }

        await admin.update(dataToUpdate)
    }
}

export default personnelService
