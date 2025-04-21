import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Account from '@/models/Account'
import Admin from '@/models/Admin'
import Station from '@/models/Station'

export interface StaffAttributes {
    staffId: number
    fullName: string
    email: string
    phoneNumber: string
    avatar: string
    hireDate: Date
    workingStationId: number
    createdAt: Date
    accountId: number
    createdBy: number
    account?: Account
}

type CreateStaffAttributes = Optional<StaffAttributes, 'staffId' | 'avatar' | 'createdAt'>

const PHONE_NUMBER_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

@Table({
    tableName: 'staffs',
    timestamps: false
})
export default class Staff extends Model<StaffAttributes, CreateStaffAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare staffId: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare fullName: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: { isEmail: true }
    })
    declare email: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
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
        allowNull: false
    })
    declare hireDate: Date

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare workingStationId: number

    @BelongsTo(() => Station, 'workingStationId')
    declare workingStation: Station

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

    @ForeignKey(() => Admin)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare createdBy: number

    @BelongsTo(() => Admin)
    declare createdByAdmin: Admin
}
