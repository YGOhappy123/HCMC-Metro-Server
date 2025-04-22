import { Op } from 'sequelize'
import { HttpException } from '@/errors/HttpException'
import { ISearchParams } from '@/interfaces/params'
import { PaymentMethod } from '@/enums/ticket'
import Line from '@/models/Line'
import Station from '@/models/Station'
import errorMessage from '@/configs/errorMessage'
import SingleJourneyTicketPrice from '@/models/SingleJourneyTicketPrice'
import Admin from '@/models/Admin'
import SubscriptionTicket from '@/models/SubscriptionTicket'
import SubscriptionTicketPrice from '@/models/SubscriptionTicketPrice'

const getStationCombinations = (stationIds: number[]) => {
    const combinations: { stations: number[]; prices: any[] }[] = []

    for (let i = 0; i < stationIds.length; i++) {
        for (let j = i; j < stationIds.length; j++) {
            if (i !== j) {
                combinations.push({
                    stations: [stationIds[i], stationIds[j]],
                    prices: []
                })
            }
        }
    }

    return combinations
}

const priceService = {
    getSingleJourneyPrice: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { line: lineId, stations } = JSON.parse(filter)
        if (!lineId || typeof lineId !== 'number') throw new HttpException(400, errorMessage.INVALID_LINE_SELECTED)

        const line = await Line.findOne({
            include: [Station],
            where: { lineId: lineId }
        })
        if (!line) throw new HttpException(400, errorMessage.INVALID_LINE_SELECTED)

        let combinations = getStationCombinations(line.stations.map(st => st.stationId))
        if (!!stations && stations?.length >= 1) {
            stations.forEach((stationId: any) => {
                combinations = combinations.filter(combo => combo.stations.includes(stationId))
            })
        }

        await Promise.all(
            combinations.map(async combo => {
                const prices = await SingleJourneyTicketPrice.findAll({
                    include: [Admin],
                    where: {
                        [Op.or]: [
                            { firstStationId: combo.stations[0], secondStationId: combo.stations[1] },
                            { firstStationId: combo.stations[1], secondStationId: combo.stations[0] }
                        ]
                    },
                    order: [['updatedAt', 'DESC']]
                })

                combo.prices = prices.map(price => price.toJSON())
            })
        )

        return {
            prices:
                skip >= combinations.length
                    ? []
                    : combinations
                          .map(combo => ({
                              ...combo,
                              stations: combo.stations.map(stationId => line.stations.find(st => st.stationId === stationId)!.toJSON())
                          }))
                          .slice(skip, skip + limit),
            total: combinations.length
        }
    },

    updateSingleJourneyPrice: async (
        adminId: number,
        firstStationId: number,
        secondStationId: number,
        paymentMethod: PaymentMethod,
        price: number
    ) => {
        const firstStation = await Station.findByPk(firstStationId)
        if (!firstStation) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

        const secondStation = await Station.findByPk(secondStationId)
        if (!secondStation) throw new HttpException(400, errorMessage.INVALID_STATION_SELECTED)

        await SingleJourneyTicketPrice.create({
            firstStationId: firstStationId,
            secondStationId: secondStationId,
            paymentMethod: paymentMethod,
            price: price,
            updatedBy: adminId
        })
    },

    getSubscriptionPrice: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { ticketId } = JSON.parse(filter)
        if (ticketId && typeof ticketId !== 'number') throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)

        const tickets = await SubscriptionTicket.findAll({
            where: ticketId ? { subscriptionTicketId: ticketId } : {}
        })
        let combinations = tickets.map(tk => ({ ticket: tk.toJSON(), prices: [] }))

        await Promise.all(
            combinations.map(async combo => {
                const prices = await SubscriptionTicketPrice.findAll({
                    include: [Admin],
                    where: { subscriptionTicketId: combo.ticket.subscriptionTicketId },
                    order: [['updatedAt', 'DESC']]
                })

                combo.prices = prices.map(price => price.toJSON())
            })
        )

        return {
            prices: skip >= combinations.length ? [] : combinations.slice(skip, skip + limit),
            total: combinations.length
        }
    },

    updateSubscriptionPrice: async (adminId: number, subscriptionTicketId: number, price: number) => {
        const ticket = await Station.findByPk(subscriptionTicketId)
        if (!ticket) throw new HttpException(400, errorMessage.INVALID_TICKET_SELECTED)

        await SubscriptionTicketPrice.create({
            subscriptionTicketId: subscriptionTicketId,
            price: price,
            updatedBy: adminId
        })
    }
}

export default priceService
