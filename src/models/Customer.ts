import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import Account from '@/models/Account'
import Order from '@/models/Order'

export interface CustomerAttributes {
    customerId: number
    fullName: string
    email: string
    phoneNumber: string
    avatar: string
    createdAt: Date
    accountId: number
    account?: Account
    orders?: Order[]
}

type CreateCustomerAttributes = Optional<CustomerAttributes, 'customerId' | 'email' | 'phoneNumber' | 'avatar' | 'createdAt'>

const PHONE_NUMBER_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

@Table({
    tableName: 'customers',
    timestamps: false
})
export default class Customer extends Model<CustomerAttributes, CreateCustomerAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare customerId: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare fullName: string

    @Column({
        type: DataType.STRING,
        validate: { isEmail: true }
    })
    declare email: string

    @Column({
        type: DataType.STRING,
        validate: { is: PHONE_NUMBER_REGEX }
    })
    declare phoneNumber: string

    @Column({
        type: DataType.STRING,
        validate: { isUrl: true }
    })
    declare avatar: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date

    @ForeignKey(() => Account)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare accountId: number

    @BelongsTo(() => Account, 'accountId')
    declare account: Account

    @HasMany(() => Order, 'customerId')
    declare orders: Order[]
}
