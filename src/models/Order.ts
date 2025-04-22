import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import { PaymentMethod } from '@/enums/ticket'
import Customer from '@/models/Customer'
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket'
import IssuedSingleJourneyTicket from '@/models/IssuedSingleJourneyTicket'

interface OrderAttributes {
    orderId: number
    customerId: number
    total: number
    paymentTime: Date
    paymentMethod: PaymentMethod
}

type CreateOrderAttributes = Optional<OrderAttributes, 'orderId' | 'customerId' | 'paymentTime'>

@Table({
    tableName: 'orders',
    timestamps: false
})
export default class Order extends Model<OrderAttributes, CreateOrderAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare orderId: number

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER
    })
    declare customerId: number

    @BelongsTo(() => Customer, 'customerId')
    declare customer: Customer

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        validate: { min: 0 }
    })
    declare total: number

    @Column({
        type: DataType.DATE
    })
    declare paymentTime: Date

    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
        defaultValue: PaymentMethod.CASH
    })
    declare paymentMethod: PaymentMethod

    @HasMany(() => IssuedSingleJourneyTicket, 'orderId')
    declare singleJourneyTickets: IssuedSingleJourneyTicket[]

    @HasMany(() => IssuedSubscriptionTicket, 'orderId')
    declare subscriptionTickets: IssuedSubscriptionTicket[]
}
