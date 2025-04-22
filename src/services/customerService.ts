import { Op } from 'sequelize'
import { HttpException } from '@/errors/HttpException'
import { capitalizeWords, generateRandomString } from '@/utils/stringHelpers'
import { buildWhereStatement } from '@/utils/queryHelpers'
import { getNow, parseTime } from '@/utils/timeHelpers'
import { ISearchParams } from '@/interfaces/params'
import { PaymentMethod, TicketStatus } from '@/enums/ticket'
import Customer, { CustomerAttributes } from '@/models/Customer'
import Account from '@/models/Account'
import Station from '@/models/Station'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import SubscriptionTicket from '@/models/SubscriptionTicket'
import stationService from '@/services/stationService'
import errorMessage from '@/configs/errorMessage'
import paymentService from '@/services/paymentService'
import Order from '@/models/Order'
import SubscriptionTicketPrice from '@/models/SubscriptionTicketPrice'

const customerService = {
    getCustomers: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: customers } = await Customer.findAndCountAll({
            include: [
                {
                    model: Order,
                    include: [
                        {
                            model: IssuedSingleJourneyTicket,
                            include: [
                                { model: Station, as: 'issuedStation' },
                                { model: Station, as: 'entryStation' },
                                { model: Station, as: 'exitStation' }
                            ]
                        },
                        {
                            model: IssuedSubscriptionTicket,
                            include: [Station, SubscriptionTicket]
                        }
                    ]
                },
                { model: Account, required: true }
            ],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
        })

        return {
            customers: customers.map(customer => {
                const { account, accountId, ...customerData } = customer.toJSON()
                return {
                    ...customerData,
                    isActive: account?.isActive
                }
            }),
            total: count
        }
    },

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
    },

    deactivateCustomerAccount: async (customerId: number) => {
        const customer = await Customer.findOne({ where: { customerId: customerId }, include: [{ model: Account, where: { isActive: true } }] })
        if (!customer) throw new HttpException(404, errorMessage.USER_NOT_FOUND)

        await Account.update({ isActive: false }, { where: { accountId: customer.accountId } })
    },

    buySingleJourneyTicket: async (customerId: number, entryStationId: number, exitStationId: number, quantity: number) => {
        const path = await stationService.getPathBetweenStations(entryStationId, exitStationId, PaymentMethod.DIGITAL_WALLET)
        if (path.length === 0) throw new HttpException(400, errorMessage.NO_AVAILABLE_PATH)

        const unitPrice = path.reduce((total, segment) => total + segment.price, 0)
        const newOrder = await Order.create({
            customerId: customerId,
            total: unitPrice * quantity,
            paymentMethod: PaymentMethod.DIGITAL_WALLET
        })

        await Promise.all(
            Array.from({ length: quantity }, () =>
                IssuedSingleJourneyTicket.create({
                    code: generateRandomString(16),
                    orderId: newOrder.orderId,
                    entryStationId,
                    exitStationId,
                    price: unitPrice,
                    expiredAt: getNow().add(30, 'day').toDate()
                })
            )
        )

        const vnpayPaymentUrl = paymentService.generateVnpayPaymentUrl(newOrder.orderId, unitPrice * quantity * 1000)
        return vnpayPaymentUrl
    },

    buySubscriptionTicket: async (customerId: number, ticketId: number, quantity: number) => {
        const ticket = await SubscriptionTicket.findByPk(ticketId)
        if (!ticket || ticket.requirements != null) throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)

        const ticketPrice = await SubscriptionTicketPrice.findOne({
            where: { subscriptionTicketId: ticketId },
            order: [['updatedAt', 'DESC']]
        })
        const unitPrice = ticketPrice?.price ?? 0

        const newOrder = await Order.create({
            customerId: customerId,
            total: unitPrice * quantity,
            paymentMethod: PaymentMethod.DIGITAL_WALLET
        })

        await Promise.all(
            Array.from({ length: quantity }, () =>
                IssuedSubscriptionTicket.create({
                    code: generateRandomString(16),
                    orderId: newOrder.orderId,
                    subscriptionTicketId: ticketId,
                    price: unitPrice,
                    expiredAt: getNow().add(ticket.validityDays, 'day').toDate()
                })
            )
        )

        const vnpayPaymentUrl = paymentService.generateVnpayPaymentUrl(newOrder.orderId, unitPrice * quantity * 1000)
        return vnpayPaymentUrl
    },

    verifyPayment: async (customerId: number, vnpParams: any) => {
        const order = await Order.findByPk(Number.parseInt(vnpParams['vnp_TxnRef']))
        if (!order) throw new HttpException(404, errorMessage.ORDER_NOT_FOUND)
        if (order.customerId !== customerId) throw new HttpException(403, errorMessage.NO_PERMISSION)

        if (vnpParams['vnp_ResponseCode'] === '00') {
            const { vnp_SecureHash, vnp_SecureHashType, ...otherParams } = vnpParams

            if (order.paymentTime == null) {
                const isSignedMatching = paymentService.verifyVnpayPaymentSigned(vnp_SecureHash, otherParams)
                if (isSignedMatching) {
                    await Promise.all([
                        order.update({
                            paymentTime: parseTime(vnpParams['vnp_PayDate'])
                        }),
                        IssuedSingleJourneyTicket.update({ status: TicketStatus.PAID }, { where: { orderId: order.orderId } }),
                        IssuedSubscriptionTicket.update({ status: TicketStatus.PAID }, { where: { orderId: order.orderId } })
                    ])
                } else {
                    throw new HttpException(400, errorMessage.PAYMENT_VERIFICATION_FAILED)
                }
            }
        } else {
            throw new HttpException(400, errorMessage.PAYMENT_VERIFICATION_FAILED)
        }
    },

    getCustomerOrders: async (customerId: number, { skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { rows: orders, count } = await Order.findAndCountAll({
            where: { ...buildWhereStatement(filter), customerId: customerId },
            include: [
                {
                    model: IssuedSingleJourneyTicket,
                    include: [
                        { model: Station, as: 'entryStation' },
                        { model: Station, as: 'exitStation' }
                    ]
                },
                {
                    model: IssuedSubscriptionTicket,
                    include: [SubscriptionTicket]
                }
            ],
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
        })

        return {
            orders: orders.map(order => order.toJSON()),
            total: count
        }
    }
}

export default customerService
