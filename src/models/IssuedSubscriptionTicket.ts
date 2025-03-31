import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { CommonPaymentMethod } from '@/enums/ticket'
import Station from '@/models/Station'
import Customer from '@/models/Customer'
import SubscriptionTicket from '@/models/SubscriptionTicket'

interface IssuedSubscriptionTicketAttributes {
    ticketId: number
    code: string
    customerId: number
    issuedStationId: number
    subscriptionTicketId: number
    paymentMethod: CommonPaymentMethod
    price: number
    purchaseDate: Date
    expirationDate: Date
}

type CreateIssuedSubscriptionTicketAttributes = Optional<IssuedSubscriptionTicketAttributes, 'ticketId' | 'customerId' | 'issuedStationId'>

const TICKET_CODE_LENGTH_RANGE = [16, 16] as const

@Table({
    tableName: 'issued_subscription_ticket',
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

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER
    })
    declare customerId: number

    @BelongsTo(() => Customer, 'customerId')
    declare customer: Customer

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
        type: DataType.ENUM(...Object.values(CommonPaymentMethod)),
        allowNull: false,
        defaultValue: CommonPaymentMethod.CASH
    })
    declare paymentMethod: CommonPaymentMethod

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        validate: { min: 0 }
    })
    declare price: number

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
}
