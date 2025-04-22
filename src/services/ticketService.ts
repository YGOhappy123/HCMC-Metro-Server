import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import SubscriptionTicket from '@/models/SubscriptionTicket'
import SubscriptionTicketPrice from '@/models/SubscriptionTicketPrice'

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
    }
}

export default ticketService
