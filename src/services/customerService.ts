import { HttpException } from '@/errors/HttpException'
import { capitalizeWords } from '@/utils/stringHelpers'
import { Op } from 'sequelize'
import Customer, { CustomerAttributes } from '@/models/Customer'
import Account from '@/models/Account'
import errorMessage from '@/configs/errorMessage'

const customerService = {
    updateCustomer: async (customerId: number, data: Partial<CustomerAttributes>) => {
        const customer = await Customer.findOne({ where: { customerId: customerId }, include: [{ model: Account, where: { isActive: true } }] })
        if (!customer) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        const dataToUpdate: Partial<CustomerAttributes> = {}

        if (data.fullName != undefined) dataToUpdate.fullName = capitalizeWords(data.fullName)
        if (data.avatar != undefined) dataToUpdate.avatar = data.avatar.trim()

        if (data.email != undefined) {
            const isEmailDuplicate = !!(await Customer.findOne({
                where: {
                    email: data.email.trim(),
                    customerId: { [Op.ne]: customerId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isEmailDuplicate) throw new HttpException(409, errorMessage.EMAIL_EXISTED)
            dataToUpdate.email = data.email.trim()
        } else {
            dataToUpdate.email = null as any
        }

        if (data.phoneNumber != undefined) {
            const isPhoneNumberDuplicate = !!(await Customer.findOne({
                where: {
                    phoneNumber: data.phoneNumber.trim(),
                    customerId: { [Op.ne]: customerId }
                },
                include: [{ model: Account, where: { isActive: true } }]
            }))
            if (isPhoneNumberDuplicate) throw new HttpException(409, errorMessage.PHONE_NUMBER_EXISTED)
            dataToUpdate.phoneNumber = data.phoneNumber.trim()
        } else {
            dataToUpdate.phoneNumber = null as any
        }

        await customer.update(dataToUpdate)
    }
}

export default customerService
