import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import { getNow, parseTime } from '@/utils/timeHelpers'
import { HttpException } from '@/errors/HttpException'
import { PaymentMethod, TicketStatus } from '@/enums/ticket'
import { Op } from 'sequelize'
import { generateRandomString } from '@/utils/stringHelpers'
import SubscriptionTicket from '@/models/SubscriptionTicket'
import SubscriptionTicketPrice from '@/models/SubscriptionTicketPrice'
import errorMessage from '@/configs/errorMessage'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import Trip from '@/models/Trip'
import Station from '@/models/Station'
import stationService from '@/services/stationService'
import Order from '@/models/Order'
import Staff from '@/models/Staff'

const START_HOUR = 5
const END_HOUR = 23

const ticketService = {
    getPublicSubscriptionTickets: async () => {
        const tickets = await SubscriptionTicket.findAll({})

        const result = await Promise.all(
            tickets.map(async ticket => {
                const ticketPrice = await SubscriptionTicketPrice.findOne({
                    where: { subscriptionTicketId: ticket.subscriptionTicketId },
                    order: [['updatedAt', 'DESC']]
                })

                return { ...ticket.toJSON(), price: ticketPrice?.price ?? 0 }
            })
        )

        return result
    },

    getSubscriptionTickets: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: tickets } = await SubscriptionTicket.findAndCountAll({
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort),
            distinct: true
        })

        return {
            tickets: tickets.map(ticket => {
                const { ...ticketData } = ticket.toJSON()
                return {
                    ...ticketData
                }
            }),
            total: count
        }
    },

    sellSingleJourneyTicket: async (staffId: number, entryStationId: number, exitStationId: number, quantity: number, method: PaymentMethod) => {
        const path = await stationService.getPathBetweenStations(entryStationId, exitStationId, PaymentMethod.DIGITAL_WALLET)
        if (path.length === 0) throw new HttpException(400, errorMessage.NO_AVAILABLE_PATH)

        const staff = await Staff.findByPk(staffId)
        if (!staff) throw new HttpException(400, errorMessage.INVALID_CREDENTIALS)

        const unitPrice = path.reduce((total, segment) => total + segment.price, 0)
        const newOrder = await Order.create({
            total: unitPrice * quantity,
            paymentMethod: method,
            paymentTime: getNow().toDate()
        })

        await Promise.all(
            Array.from({ length: quantity }, () =>
                IssuedSingleJourneyTicket.create({
                    code: generateRandomString(16),
                    orderId: newOrder.orderId,
                    entryStationId,
                    exitStationId,
                    price: unitPrice,
                    expiredAt: getNow().add(30, 'day').toDate(),
                    issuedStationId: staff.workingStationId,
                    status: TicketStatus.PAID
                })
            )
        )
    },

    sellSubscriptionTicket: async (staffId: number, ticketId: number, quantity: number, method: PaymentMethod) => {
        const ticket = await SubscriptionTicket.findByPk(ticketId)
        if (!ticket || ticket.requirements != null) throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)

        const staff = await Staff.findByPk(staffId)
        if (!staff) throw new HttpException(400, errorMessage.INVALID_CREDENTIALS)

        const ticketPrice = await SubscriptionTicketPrice.findOne({
            where: { subscriptionTicketId: ticketId },
            order: [['updatedAt', 'DESC']]
        })
        const unitPrice = ticketPrice?.price ?? 0

        const newOrder = await Order.create({
            total: unitPrice * quantity,
            paymentMethod: PaymentMethod.DIGITAL_WALLET,
            paymentTime: getNow().toDate()
        })

        await Promise.all(
            Array.from({ length: quantity }, () =>
                IssuedSubscriptionTicket.create({
                    code: generateRandomString(16),
                    orderId: newOrder.orderId,
                    subscriptionTicketId: ticketId,
                    price: unitPrice,
                    expiredAt: getNow().add(ticket.validityDays, 'day').toDate(),
                    issuedStationId: staff.workingStationId,
                    status: TicketStatus.PAID
                })
            )
        )
    },

    demoCheckIn: async (ticketCode: string, entryStationId: number) => {
        const currentTime = getNow()
        const hour = currentTime.get('hour')
        const minute = currentTime.get('minute')

        if (hour < START_HOUR || (hour === START_HOUR && minute === 0) || hour >= END_HOUR) {
            throw new HttpException(400, errorMessage.INVALID_CHECK_IN_TIME)
        }

        const station = await Station.findByPk(entryStationId)
        if (!station) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

        const singleJourneyTicket = await IssuedSingleJourneyTicket.findOne({
            where: { code: ticketCode }
        })
        const subscriptionTicket = await IssuedSubscriptionTicket.findOne({
            where: { code: ticketCode }
        })

        if (singleJourneyTicket) {
            switch (singleJourneyTicket.status) {
                case TicketStatus.UNPAID:
                    throw new HttpException(400, errorMessage.TICKET_UNPAID)
                case TicketStatus.USED:
                    throw new HttpException(400, errorMessage.TICKET_ALREADY_USED)
                case TicketStatus.ONBOARD:
                    throw new HttpException(400, errorMessage.TICKET_ALREADY_CHECKED_IN)
            }

            if (currentTime.toDate() >= parseTime(singleJourneyTicket.expiredAt as any)) {
                throw new HttpException(400, errorMessage.TICKET_EXPIRED)
            }

            if (singleJourneyTicket.entryStationId !== entryStationId) {
                throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)
            }

            await Promise.all([
                singleJourneyTicket.update({
                    status: TicketStatus.ONBOARD
                }),
                Trip.create({
                    singleJourneyTicketId: singleJourneyTicket.ticketId,
                    entryStationId: entryStationId,
                    entryTime: currentTime.toDate()
                })
            ])
        } else if (subscriptionTicket) {
            switch (subscriptionTicket.status) {
                case TicketStatus.UNPAID:
                    throw new HttpException(400, errorMessage.TICKET_UNPAID)
                case TicketStatus.ONBOARD:
                    throw new HttpException(400, errorMessage.TICKET_ALREADY_CHECKED_IN)
            }

            if (currentTime.toDate() >= parseTime(subscriptionTicket.expiredAt as any)) {
                throw new HttpException(400, errorMessage.TICKET_EXPIRED)
            }

            await Promise.all([
                subscriptionTicket.update({
                    status: TicketStatus.ONBOARD
                }),
                Trip.create({
                    subscriptionTicketId: subscriptionTicket.ticketId,
                    entryStationId: entryStationId,
                    entryTime: currentTime.toDate()
                })
            ])
        } else {
            throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)
        }
    },

    demoCheckOut: async (ticketCode: string, exitStationId: number) => {
        const currentTime = getNow()

        const station = await Station.findByPk(exitStationId)
        if (!station) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

        const singleJourneyTicket = await IssuedSingleJourneyTicket.findOne({
            where: { code: ticketCode }
        })
        const subscriptionTicket = await IssuedSubscriptionTicket.findOne({
            where: { code: ticketCode }
        })

        if (singleJourneyTicket) {
            switch (singleJourneyTicket.status) {
                case TicketStatus.UNPAID:
                    throw new HttpException(400, errorMessage.TICKET_UNPAID)
                case TicketStatus.USED:
                    throw new HttpException(400, errorMessage.TICKET_ALREADY_USED)
                case TicketStatus.PAID:
                    throw new HttpException(400, errorMessage.TICKET_NOT_CHECKED_IN)
            }

            if (singleJourneyTicket.exitStationId !== exitStationId) {
                throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)
            }

            const trip = await Trip.findOne({
                where: {
                    singleJourneyTicketId: singleJourneyTicket.ticketId,
                    exitStationId: { [Op.eq]: null } as any
                }
            })
            if (!trip || trip.entryStationId === exitStationId) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

            await Promise.all([
                singleJourneyTicket.update({
                    status: TicketStatus.USED
                }),
                trip.update({
                    exitStationId: exitStationId,
                    exitTime: currentTime.toDate()
                })
            ])
        } else if (subscriptionTicket) {
            switch (subscriptionTicket.status) {
                case TicketStatus.UNPAID:
                    throw new HttpException(400, errorMessage.TICKET_UNPAID)
                case TicketStatus.PAID:
                    throw new HttpException(400, errorMessage.TICKET_NOT_CHECKED_IN)
            }

            const trip = await Trip.findOne({
                where: {
                    subscriptionTicketId: subscriptionTicket.ticketId,
                    exitStationId: { [Op.eq]: null } as any
                }
            })
            if (!trip || trip.entryStationId === exitStationId) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

            await Promise.all([
                subscriptionTicket.update({
                    status: TicketStatus.PAID
                }),
                trip.update({
                    exitStationId: exitStationId,
                    exitTime: currentTime.toDate()
                })
            ])
        } else {
            throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)
        }
    }
}

export default ticketService
