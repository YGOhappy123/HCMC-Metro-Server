import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import IssuedSfcCard from '@/models/IssuedSfcCard'
import Order from '@/models/Order'
import Station from '@/models/Station'
import Customer from '@/models/Customer'
import SubscriptionTicket from '@/models/SubscriptionTicket'

const issuedTicketService = {
    getSingleJourneyTickets: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: tickets } = await IssuedSingleJourneyTicket.findAndCountAll({
            include: [
                { model: Order, include: [Customer] },
                { model: Station, as: 'issuedStation' },
                { model: Station, as: 'entryStation' },
                { model: Station, as: 'exitStation' }
            ],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
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

    getSubscriptionTickets: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: tickets } = await IssuedSubscriptionTicket.findAndCountAll({
            include: [SubscriptionTicket, { model: Order, include: [Customer] }, { model: Station, as: 'issuedStation' }],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
        })

        return {
            tickets: tickets.map(ticket => {
                const { issuedStationId, subscriptionTicketId, ...ticketData } = ticket.toJSON()
                return {
                    ...ticketData
                }
            }),
            total: count
        }
    },

    getSfcCards: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: cards } = await IssuedSfcCard.findAndCountAll({
            include: [Station],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort)
        })

        return {
            cards: cards.map(ticket => {
                const { issuedStationId, ...ticketData } = ticket.toJSON()
                return {
                    ...ticketData
                }
            }),
            total: count
        }
    }
}

export default issuedTicketService
