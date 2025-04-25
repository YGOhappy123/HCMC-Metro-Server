import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { TicketStatus } from '@/enums/ticket'
import Station from '@/models/Station'
import SubscriptionTicket from '@/models/SubscriptionTicket'
import Order from '@/models/Order'
import Trip from '@/models/Trip'

interface IssuedSubscriptionTicketAttributes {
    ticketId: number
    code: string
    orderId: number
    issuedStationId: number
    subscriptionTicketId: number
    price: number
    status: TicketStatus
    issuedAt: Date
    expiredAt: Date
}

type CreateIssuedSubscriptionTicketAttributes = Optional<
    IssuedSubscriptionTicketAttributes,
    'ticketId' | 'issuedStationId' | 'status' | 'issuedAt' | 'expiredAt'
>

const TICKET_CODE_LENGTH_RANGE = [16, 16] as const

@Table({
    tableName: 'issued_subscription_tickets',
    timestamps: false
})
export default class IssuedSubscriptionTicket extends Model<IssuedSubscriptionTicketAttributes, CreateIssuedSubscriptionTicketAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare ticketId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { len: TICKET_CODE_LENGTH_RANGE }
    })
    declare code: string

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare orderId: number

    @BelongsTo(() => Order, 'orderId')
    declare order: Order

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER
    })
    declare issuedStationId: number

    @BelongsTo(() => Station, 'issuedStationId')
    declare issuedStation: Station

    @ForeignKey(() => SubscriptionTicket)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare subscriptionTicketId: number

    @BelongsTo(() => SubscriptionTicket, 'subscriptionTicketId')
    declare subscriptionTicket: SubscriptionTicket

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        validate: { min: 0 }
    })
    declare price: number

    @Column({
        type: DataType.ENUM(...Object.values(TicketStatus)),
        allowNull: false,
        defaultValue: TicketStatus.UNPAID
    })
    declare status: TicketStatus

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare issuedAt: Date

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare expiredAt: Date

    @HasMany(() => Trip, 'subscriptionTicketId')
    declare trips: Trip[]
}
