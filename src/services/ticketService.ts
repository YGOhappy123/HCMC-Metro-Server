import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import SubscriptionTicket from '@/models/SubscriptionTicket'

const ticketService = {
    getSubscriptionTickets: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: tickets } = await SubscriptionTicket.findAndCountAll({
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
    }
}

export default ticketService
