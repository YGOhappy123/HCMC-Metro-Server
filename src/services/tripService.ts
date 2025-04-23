import { ISearchParams } from '@/interfaces/params'
import { buildWhereStatement } from '@/utils/queryHelpers'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import Station from '@/models/Station'
import Trip from '@/models/Trip'
import SubscriptionTicket from '@/models/SubscriptionTicket'

const tripService = {
    getTrips: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: trips } = await Trip.findAndCountAll({
            include: [
                { model: Station, as: 'entryStation' },
                { model: Station, as: 'exitStation' },
                IssuedSingleJourneyTicket,
                { model: IssuedSubscriptionTicket, include: [SubscriptionTicket] }
            ],
            where: buildWhereStatement(filter),
            limit: limit,
            offset: skip,
            order: JSON.parse(sort),
            distinct: true
        })

        return {
            trips: trips.map(ticket => {
                const { ...tripData } = ticket.toJSON()
                return {
                    ...tripData
                }
            }),
            total: count
        }
    }
}

export default tripService
