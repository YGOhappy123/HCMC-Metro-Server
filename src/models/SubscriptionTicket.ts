import { Optional } from 'sequelize'
import { Column, DataType, Model, Table } from 'sequelize-typescript'

interface SubscriptionTicketAttributes {
    ticketId: number
    name: string
    requirements: string
    validityDays: number
}

type CreateSubscriptionTicketAttributes = Optional<SubscriptionTicketAttributes, 'ticketId' | 'requirements'>

@Table({
    tableName: 'subscription_ticket',
    timestamps: false
})
export default class SubscriptionTicket extends Model<SubscriptionTicketAttributes, CreateSubscriptionTicketAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare subscriptionTicketId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare ticketName: string

    @Column({
        type: DataType.TEXT
    })
    declare requirements: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    })
    declare validityDays: number
}
