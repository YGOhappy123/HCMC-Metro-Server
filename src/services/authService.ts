import * as bcrypt from 'bcrypt'
import axios from 'axios'

import { HttpException } from '@/errors/HttpException'
import {
    generateAccessToken,
    generateRefreshToken,
    generateResetPasswordToken,
    verifyRefreshToken,
    verifyResetPasswordToken
} from '@/utils/jwtHelpers'
import { capitalizeWords, generateRandomString } from '@/utils/stringHelpers'
import { UserRole } from '@/enums/auth'
import Account from '@/models/Account'
import Customer from '@/models/Customer'
import Staff from '@/models/Staff'
import Admin from '@/models/Admin'
import errorMessage from '@/configs/errorMessage'
import mailerService from '@/services/mailerService'

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
            accountId: newAccount.accountId,
            avatar: process.env.SQL_DEFAULT_AVATAR_URL
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
    },

    forgotPassword: async (email: string) => {
        const customer = await Customer.findOne({ where: { email: email } })
        if (!customer) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        const account = await Account.findOne({ where: { accountId: customer?.accountId } })
        if (!account || !account.isActive) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        mailerService.sendResetPasswordMail(
            email,
            customer.fullName,
            `${process.env.CLIENT_URL}/auth?type=reset&token=${generateResetPasswordToken({ email: email, type: 'forgot' })}`
        )
    },

    resetPassword: async (resetPasswordToken: string, password: string) => {
        const { email } = verifyResetPasswordToken(resetPasswordToken)
        const account = await Account.findOne({
            where: { isActive: true },
            include: [{ model: Customer, where: { email: email } }]
        })
        if (!account || !account.isActive) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        await account.update({ password: password })
    },

    changePassword: async (oldPassword: string, newPassword: string, userId: number, role: UserRole) => {
        let accountId = null
        switch (role) {
            case UserRole.CUSTOMER:
                const customer = await Customer.findByPk(userId)
                if (customer) {
                    accountId = customer.accountId
                }
                break
            case UserRole.STAFF:
                const staff = await Staff.findByPk(userId)
                if (staff) {
                    accountId = staff.accountId
                }
                break
            case UserRole.ADMIN:
                const admin = await Admin.findByPk(userId)
                if (admin) {
                    accountId = admin.accountId
                }
                break
        }
        if (!accountId) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        const account = await Account.findByPk(accountId)
        if (!account || !account.isActive) throw new HttpException(400, errorMessage.USER_NOT_FOUND)

        const isPasswordMatching = await bcrypt.compare(oldPassword, account.password)
        if (!isPasswordMatching) throw new HttpException(400, errorMessage.INCORRECT_PASSWORD)

        await account.update({ password: newPassword })
    },

    loginByGoogleAccount: async (googleAccessToken: string) => {
        const { data } = await axios.get(process.env.GOOGLE_OAUTH_ENDPOINT!, {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        })

        const { given_name: firstName = 'Unknown', family_name: lastName = 'Unknown', picture: avatar, email, email_verified: isEmailVerified } = data
        if (!isEmailVerified) throw new HttpException(403, errorMessage.EMAIL_VERIFICATION_FAILED)

        const customer = await Customer.findOne({ where: { email: email }, include: [{ model: Account, where: { isActive: true } }] })
        if (!customer) {
            const randomUsername = generateRandomString()
            const randomPassword = generateRandomString()

            const newAccount = await Account.create({
                username: randomUsername,
                password: randomPassword
            })

            const customerFullName = capitalizeWords(`${lastName} ${firstName}`)
            const newCustomer = await Customer.create({
                fullName: customerFullName,
                accountId: newAccount.accountId,
                email: email,
                avatar: avatar
            })

            mailerService.sendGoogleRegistrationMail(
                email,
                customerFullName,
                randomUsername,
                randomPassword,
                `${process.env.CLIENT_URL}/auth?type=reset&token=${generateResetPasswordToken({ email: email, type: 'google' })}`
            )

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
        } else {
            const { customerId, account, ...customerData } = customer.toJSON()

            return {
                user: {
                    ...customerData,
                    userId: customerId,
                    role: UserRole.CUSTOMER
                },
                accessToken: generateAccessToken({ userId: customerId!, role: UserRole.CUSTOMER }),
                refreshToken: generateRefreshToken({ accountId: account!.accountId })
            }
        }
    }
}

export default authService
