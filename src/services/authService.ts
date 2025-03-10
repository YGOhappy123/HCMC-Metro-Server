import * as bcrypt from 'bcrypt'
import { HttpException } from '@/errors/HttpException'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwtHelpers'
import { capitalizeWords } from '@/utils/stringHelpers'
import Account, { UserRole } from '@/models/Account'
import Customer from '@/models/Customer'
import Staff from '@/models/Staff'
import Admin from '@/models/Admin'
import errorMessage from '@/configs/errorMessage'

const authService = {
    loginWithUsername: async (username: string, password: string) => {
        const account = await Account.findOne({ where: { username: username } })
        if (!account || !account.isActive) throw new HttpException(400, errorMessage.INCORRECT_USERNAME_OR_PASSWORD)

        const isPasswordMatching = await bcrypt.compare(password, account.password)
        if (!isPasswordMatching) throw new HttpException(400, errorMessage.INCORRECT_USERNAME_OR_PASSWORD)

        let userData: any = null
        let userId: number | null = null

        switch (account.role) {
            case UserRole.CUSTOMER:
                const customer = await Customer.findOne({ where: { accountId: account.accountId } })
                if (customer) {
                    userId = customer.customerId
                    userData = customer.toJSON()
                    delete userData.customerId
                }
                break
            case UserRole.STAFF:
                const staff = await Staff.findOne({ where: { accountId: account.accountId } })
                if (staff) {
                    userId = staff.staffId
                    userData = staff.toJSON()
                    delete userData.staffId
                }
                break
            case UserRole.ADMIN:
                const admin = await Admin.findOne({ where: { accountId: account.accountId } })
                if (admin) {
                    userId = admin.adminId
                    userData = admin.toJSON()
                    delete userData.adminId
                }
                break
        }

        if (!userData) throw new HttpException(404, errorMessage.USER_NOT_FOUND)
        return {
            user: {
                ...userData,
                userId: userId,
                role: account.role
            },
            accessToken: generateAccessToken({ userId: userId!, role: account.role }),
            refreshToken: generateRefreshToken({ accountId: account.accountId })
        }
    },

    registerCustomerAccount: async (username: string, password: string, fullName: string) => {
        const account = await Account.findOne({ where: { username: username } })
        if (account) throw new HttpException(409, errorMessage.USERNAME_EXISTED)

        const newAccount = await Account.create({
            username: username,
            password: password
        })

        const newCustomer = await Customer.create({
            fullName: capitalizeWords(fullName),
            accountId: newAccount.accountId
        })

        const { customerId, ...userData } = newCustomer.toJSON()
        return {
            user: {
                ...userData,
                userId: customerId,
                role: UserRole.CUSTOMER
            },
            accessToken: generateAccessToken({ userId: customerId, role: UserRole.CUSTOMER }),
            refreshToken: generateRefreshToken({ accountId: newAccount.accountId })
        }
    },

    refreshToken: async (refreshToken: string) => {
        const { accountId } = verifyRefreshToken(refreshToken)

        const account = await Account.findOne({ where: { accountId: accountId } })
        if (!account || !account.isActive) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        let userId: number | null = null
        switch (account.role) {
            case UserRole.CUSTOMER:
                const customer = await Customer.findOne({ where: { accountId: account.accountId }, attributes: ['customerId'] })
                if (customer) {
                    userId = customer.customerId
                }
                break
            case UserRole.STAFF:
                const staff = await Staff.findOne({ where: { accountId: account.accountId }, attributes: ['staffId'] })
                if (staff) {
                    userId = staff.staffId
                }
                break
            case UserRole.ADMIN:
                const admin = await Admin.findOne({ where: { accountId: accountId }, attributes: ['adminId'] })
                if (admin) {
                    userId = admin.adminId
                }
                break
        }

        if (!userId) throw new HttpException(404, errorMessage.USER_NOT_FOUND)
        return {
            accessToken: generateAccessToken({ userId: userId, role: account.role })
        }
    }
}

export default authService
