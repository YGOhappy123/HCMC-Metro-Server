import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table } from 'sequelize-typescript'
import { TicketStatus } from '@/enums/ticket'
import Station from '@/models/Station'
import Order from '@/models/Order'
import Trip from '@/models/Trip'

interface IssuedSingleJourneyTicketAttributes {
    ticketId: number
    code: string
    orderId: number
    issuedStationId: number
    entryStationId: number
    exitStationId: number
    price: number
    status: TicketStatus
    issuedAt: Date
    expiredAt: Date
}

type CreateIssuedSingleJourneyTicketAttributes = Optional<
    IssuedSingleJourneyTicketAttributes,
    'ticketId' | 'issuedStationId' | 'status' | 'issuedAt' | 'expiredAt'
>

const TICKET_CODE_LENGTH_RANGE = [16, 16] as const

@Table({
    tableName: 'issued_single_journey_tickets',
    timestamps: false
})
export default class IssuedSingleJourneyTicket extends Model<IssuedSingleJourneyTicketAttributes, CreateIssuedSingleJourneyTicketAttributes> {
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

    @BelongsTo(() => Station, { foreignKey: 'issuedStationId', as: 'issuedStation' })
    declare issuedStation: Station

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare entryStationId: number

    @BelongsTo(() => Station, { foreignKey: 'entryStationId', as: 'entryStation' })
    declare entryStation: Station

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare exitStationId: number

    @BelongsTo(() => Station, { foreignKey: 'exitStationId', as: 'exitStation' })
    declare exitStation: Station

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

    @HasOne(() => Trip, 'singleJourneyTicketId')
    declare trip: Trip
}
