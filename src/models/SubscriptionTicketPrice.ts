import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Admin from '@/models/Admin'
import SubscriptionTicket from '@/models/SubscriptionTicket'

interface SubscriptionTicketPriceAttributes {
    priceId: number
    subscriptionTicketId: number
    price: number
    updatedAt: Date
    updatedBy: number
}

type CreateSubscriptionTicketPriceAttributes = Optional<SubscriptionTicketPriceAttributes, 'priceId' | 'updatedAt'>

@Table({
    tableName: 'subscription_ticket_price',
    timestamps: false
})
export default class SubscriptionTicketPrice extends Model<SubscriptionTicketPriceAttributes, CreateSubscriptionTicketPriceAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare priceId: number

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
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare updatedAt: Date

    @ForeignKey(() => Admin)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare updatedBy: number

    @BelongsTo(() => Admin, 'updatedBy')
    declare updatedByAdmin: Admin
}
