import { Op } from 'sequelize'
import { HttpException } from '@/errors/HttpException'
import { capitalizeWords } from '@/utils/stringHelpers'
import Staff, { StaffAttributes } from '@/models/Staff'
import Admin, { AdminAttributes } from '@/models/Admin'
import Account from '@/models/Account'
import errorMessage from '@/configs/errorMessage'
import { UserRole } from '@/enums/auth'

const personnelService = {
    // STAFF LOGIC
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
