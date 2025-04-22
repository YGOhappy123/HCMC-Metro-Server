import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Station from '@/models/Station'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'

export interface TripAttributes {
    tripId: number
    singleJourneyTicketId: number
    subscriptionTicketId: number
    entryStationId: number
    exitStationId: number
    entryTime: Date
    exitTime: Date
}

type CreateTripAttributes = Optional<
    TripAttributes,
    'tripId' | 'singleJourneyTicketId' | 'subscriptionTicketId' | 'exitStationId' | 'entryTime' | 'exitTime'
>

@Table({
    tableName: 'trips',
    timestamps: false
})
export default class Trip extends Model<TripAttributes, CreateTripAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare tripId: number

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare entryStationId: number

    @BelongsTo(() => Station, 'entryStationId')
    declare entryStation: Station

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER
    })
    declare exitStationId: number

    @BelongsTo(() => Station, 'exitStationId')
    declare exitStation: Station

    @ForeignKey(() => IssuedSingleJourneyTicket)
    @Column({
        type: DataType.INTEGER
    })
    declare singleJourneyTicketId: number

    @BelongsTo(() => IssuedSingleJourneyTicket, 'singleJourneyTicketId')
    declare singleJourneyTicket: IssuedSingleJourneyTicket

    @ForeignKey(() => IssuedSubscriptionTicket)
    @Column({
        type: DataType.INTEGER
    })
    declare subscriptionTicketId: number

    @BelongsTo(() => IssuedSubscriptionTicket, 'subscriptionTicketId')
    declare subscriptionTicket: IssuedSubscriptionTicket

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare entryTime: Date

    @Column({
        type: DataType.DATE
    })
    declare exitTime: Date
}
