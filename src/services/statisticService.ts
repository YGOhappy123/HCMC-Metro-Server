import { Op } from 'sequelize'
import { Dayjs, ManipulateType } from 'dayjs'
import { TicketStatus } from '@/enums/ticket'
import { StatisticType } from '@/interfaces/params'
import { capitalizeWords } from '@/utils/stringHelpers'
import { getNow, getPreviousTimeByType, getStartOfTimeByType, isSame, parseTime } from '@/utils/timeHelpers'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import Customer from '@/models/Customer'
import Order from '@/models/Order'

const prepareCreateChartParams = (type: StatisticType, startDate: Dayjs) => {
    switch (type) {
        case 'daily':
            return {
                columns: 24,
                timeUnit: 'hour',
                format: 'HH:mm'
            }
        case 'weekly':
            return {
                columns: 7,
                timeUnit: 'day',
                format: 'dddd DD-MM'
            }
        case 'monthly':
            return {
                columns: startDate.daysInMonth(),
                timeUnit: 'day',
                format: 'DD'
            }
        case 'yearly':
            return {
                columns: 12,
                timeUnit: 'month',
                format: 'MMMM'
            }
    }
}

const createRevenuesChart = ({
    tickets,
    startDate,
    columns,
    timeUnit,
    format
}: {
    tickets: any
    startDate: Dayjs
    columns: number
    timeUnit: ManipulateType
    format: string
}) => {
    const results = Array.from(Array(columns), (_, i) => ({
        date: startDate.add(i, timeUnit),
        name: startDate.add(i, timeUnit).format(format),
        totalSales: 0,
        totalUnits: 0
    }))
    tickets.forEach((ticket: any) => {
        const index = results.findIndex(result => isSame(ticket.issuedAt, result.date, timeUnit))
        results[index].totalSales = results[index].totalSales + parseFloat(ticket.price)
        results[index].totalUnits = results[index].totalUnits + 1
    })
    return results.map(res => ({
        name: capitalizeWords(res.name),
        totalSales: res.totalSales,
        totalUnits: res.totalUnits
    }))
}

const statisticService = {
    getSummaryStatistic: async (type: StatisticType) => {
        const currentTime = getNow()
        const startOfTimeByType = getStartOfTimeByType(currentTime, type)
        const startOfPrevTimeByType = getPreviousTimeByType(startOfTimeByType, type)

        const currCustomersCount = await Customer.count({
            where: {
                createdAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] }
            }
        })
        const prevCustomersCount = await Customer.count({
            where: {
                createdAt: { [Op.and]: [{ [Op.gte]: startOfPrevTimeByType.toDate() }, { [Op.lte]: startOfTimeByType.toDate() }] }
            }
        })

        const currSingleJourneys = await IssuedSingleJourneyTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })
        const prevSingleJourneys = await IssuedSingleJourneyTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfPrevTimeByType.toDate() }, { [Op.lte]: startOfTimeByType.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })

        const currSubscriptions = await IssuedSubscriptionTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })
        const prevSubscriptions = await IssuedSubscriptionTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfPrevTimeByType.toDate() }, { [Op.lte]: startOfTimeByType.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })

        return {
            users: {
                currentCount: currCustomersCount,
                previousCount: prevCustomersCount
            },
            ticketCount: {
                currentCount: currSingleJourneys.length + currSubscriptions.length,
                previousCount: prevSingleJourneys.length + prevSubscriptions.length
            },
            revenues: {
                currentCount: currSingleJourneys.reduce((acc, tk) => acc + tk.price, 0) + currSubscriptions.reduce((acc, tk) => acc + tk.price, 0),
                previousCount: prevSingleJourneys.reduce((acc, tk) => acc + tk.price, 0) + prevSubscriptions.reduce((acc, tk) => acc + tk.price, 0)
            }
        }
    },

    getPopularStatistic: async (type: StatisticType) => {
        const currentTime = getNow()
        const startOfTimeByType = getStartOfTimeByType(currentTime, type)

        const newestCustomers = await Customer.findAll({
            where: {
                createdAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] }
            },
            order: [['createdAt', 'DESC']],
            limit: 5
        })

        const customersWithOrders = await Customer.findAll({
            include: [
                {
                    model: Order,
                    required: true,
                    include: [IssuedSingleJourneyTicket, IssuedSubscriptionTicket]
                }
            ]
        })

        const highestRevenueCustomers = customersWithOrders
            .map(cus => {
                let ticketCount = 0
                const totalRevenues = cus.orders.reduce((total, order: any) => {
                    const ticket = order.subscriptionTickets?.[0] || order.singleJourneyTickets?.[0]

                    if (
                        ticket.status !== TicketStatus.UNPAID &&
                        parseTime(ticket.issuedAt) >= startOfTimeByType.toDate() &&
                        parseTime(ticket.issuedAt) <= currentTime.toDate()
                    ) {
                        ticketCount += order.subscriptionTickets.length + order.singleJourneyTickets.length
                        return total + order.total
                    }

                    return total
                }, 0)

                const customerData = cus.toJSON()

                return {
                    customerId: customerData.customerId,
                    fullName: customerData.fullName,
                    email: customerData.email,
                    phoneNumber: customerData.phoneNumber,
                    avatar: customerData.avatar,
                    createdAt: customerData.createdAt,
                    totalRevenues: totalRevenues,
                    ticketCount: ticketCount
                }
            })
            .filter(cus => cus.totalRevenues > 0)
            .sort((a, b) => b.totalRevenues - a.totalRevenues)
            .slice(0, 5)

        return {
            newestCustomers: newestCustomers.map(customer => ({
                customerId: customer.customerId,
                fullName: customer.fullName,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
                avatar: customer.avatar,
                createdAt: customer.createdAt
            })),
            highestRevenueCustomers: highestRevenueCustomers
        }
    },

    getRevenuesChart: async (type: StatisticType) => {
        const currentTime = getNow()
        const startOfTimeByType = getStartOfTimeByType(currentTime, type)

        const singleJourneys = await IssuedSingleJourneyTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })
        const subscriptions = await IssuedSubscriptionTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })

        const { columns, timeUnit, format } = prepareCreateChartParams(type, startOfTimeByType)

        return createRevenuesChart({
            tickets: [...singleJourneys.map(tk => tk.toJSON()), ...subscriptions.map(tk => tk.toJSON())],
            startDate: startOfTimeByType,
            columns,
            timeUnit: timeUnit as ManipulateType,
            format
        })
    },

    getOriginsChart: async (type: StatisticType) => {
        const currentTime = getNow()
        const startOfTimeByType = getStartOfTimeByType(currentTime, type)
        const result = {
            station: { totalSales: 0, totalUnits: 0 },
            website: { totalSales: 0, totalUnits: 0 }
        }

        const singleJourneys = await IssuedSingleJourneyTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })
        singleJourneys.forEach(ticket => {
            if (ticket.issuedStationId == null) {
                result.website.totalUnits += 1
                result.website.totalSales += ticket.price
            } else {
                result.station.totalUnits += 1
                result.station.totalSales += ticket.price
            }
        })

        const subscriptions = await IssuedSubscriptionTicket.findAll({
            where: {
                issuedAt: { [Op.and]: [{ [Op.gte]: startOfTimeByType.toDate() }, { [Op.lte]: currentTime.toDate() }] },
                status: { [Op.ne]: TicketStatus.UNPAID }
            }
        })
        subscriptions.forEach(ticket => {
            if (ticket.issuedStationId == null) {
                result.website.totalUnits += 1
                result.website.totalSales += ticket.price
            } else {
                result.station.totalUnits += 1
                result.station.totalSales += ticket.price
            }
        })

        return Object.entries(result).map(([origin, data]) => ({ origin: origin, ...data }))
    }
}

export default statisticService
