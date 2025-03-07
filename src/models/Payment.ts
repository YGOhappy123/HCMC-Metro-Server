import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import SoldTicket from '@/models/SoldTicket'
import SfcTrip from '@/models/SfcTrip'

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'creditCard',
    DIGITAL_WALLET = 'digitalWallet',
    SFC = 'sfc'
}

interface PaymentAttributes {
    paymentId: number
    ticketId: number
    sfcTripId: number
    amount: number
    paymentMethod: PaymentMethod
    paymentDate: Date
}

type CreatePaymentAttributes = Optional<PaymentAttributes, 'paymentId' | 'ticketId' | 'sfcTripId' | 'paymentDate'>

@Table({
    tableName: 'payment',
    timestamps: false
})
export default class Payment extends Model<PaymentAttributes, CreatePaymentAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare paymentId: number

    @ForeignKey(() => SoldTicket)
    @Column({
        type: DataType.INTEGER
    })
    declare ticketId: number

    @BelongsTo(() => SoldTicket, 'ticketId')
    declare ticket: SoldTicket

    @ForeignKey(() => SfcTrip)
    @Column({
        type: DataType.INTEGER
    })
    declare sfcTripId: number

    @BelongsTo(() => SfcTrip, 'sfcTripId')
    declare sfcTrip: SfcTrip

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        validate: { min: 0 }
    })
    declare amount: number

    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
        defaultValue: PaymentMethod.CASH
    })
    declare paymentMethod: PaymentMethod

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare paymentDate: Date
}
