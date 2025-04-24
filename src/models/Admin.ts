import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import Account from '@/models/Account'
import Staff from '@/models/Staff'

export interface AdminAttributes {
    adminId: number
    fullName: string
    email: string
    phoneNumber: string
    avatar: string
    createdAt: Date
    accountId: number
    createdBy: number
    account?: Account
}

type CreateAdminAttributes = Optional<AdminAttributes, 'adminId' | 'avatar' | 'createdAt' | 'createdBy'>

const PHONE_NUMBER_REGEX = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

@Table({
    tableName: 'admins',
    timestamps: false
})
export default class Admin extends Model<AdminAttributes, CreateAdminAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare adminId: number

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
        allowNull: true
    })
    declare createdBy: number

    @BelongsTo(() => Admin, { foreignKey: 'createdBy', as: 'createdByAdmin' })
    declare createdByAdmin: Admin | null

    @HasMany(() => Admin, 'createdBy')
    declare createdAdmins: Admin[]

    @HasMany(() => Staff, 'createdBy')
    declare createdStaffs: Staff[]
}
