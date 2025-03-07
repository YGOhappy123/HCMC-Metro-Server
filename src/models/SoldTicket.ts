import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { PaymentMethod } from '@/models/Payment'
import Admin from '@/models/Admin'
import Station from '@/models/Station'
import Customer from '@/models/Customer'
import SubscriptionTicket from '@/models/SubscriptionTicket'

export enum TicketStatus {
    ACTIVE = 'active',
    ONBOARD = 'onboard',
    USED = 'used',
    EXPIRED = 'expired'
}

interface SoldTicketAttributes {
    ticketId: number
    code: string
    customerId: number
    issuedStationId: number
    subscriptionTicketId: number
    entryStationId: number
    exitStationId: number
    price: number
    purchaseDate: Date
    expirationDate: Date
    status: TicketStatus
}

type CreateSoldTicketAttributes = Optional<
    SoldTicketAttributes,
    'ticketId' | 'customerId' | 'issuedStationId' | 'subscriptionTicketId' | 'entryStationId' | 'exitStationId' | 'status'
>

const TICKET_CODE_LENGTH_RANGE = [16, 16] as const

@Table({
    tableName: 'sold_ticket',
    timestamps: false
})
export default class SoldTicket extends Model<SoldTicketAttributes, CreateSoldTicketAttributes> {
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
        type: DataType.INTEGER
    })
    declare subscriptionTicketId: number

    @BelongsTo(() => SubscriptionTicket, 'subscriptionTicketId')
    declare subscriptionTicket: SubscriptionTicket

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER
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
    declare purchaseDate: Date

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare expirationDate: Date

    @Column({
        type: DataType.ENUM(...Object.values(TicketStatus)),
        allowNull: false,
        defaultValue: TicketStatus.ACTIVE
    })
    declare status: TicketStatus
}
