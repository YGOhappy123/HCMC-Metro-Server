import * as bcrypt from 'bcrypt'
import { Optional } from 'sequelize'
import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { HttpException } from '@/errors/HttpException'
import errorMessage from '@/configs/errorMessage'

export enum UserRole {
    CUSTOMER = 'customer',
    STAFF = 'staff',
    ADMIN = 'admin'
}

interface AccountAttributes {
    accountId: number
    username: string
    password: string
    role: UserRole
    isActive: boolean
}

type CreateAccountAttributes = Optional<AccountAttributes, 'accountId' | 'role' | 'isActive'>

const USERNAME_LENGTH_RANGE = [8, 20] as const
const PASSWORD_LENGTH_RANGE = [8, 20] as const
const BCRYPT_SALT_ROUNDS = 10

@Table({
    tableName: 'account',
    timestamps: false
})
export default class Account extends Model<AccountAttributes, CreateAccountAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare accountId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { len: USERNAME_LENGTH_RANGE }
    })
    declare username: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        set(value: string) {
            const [minLength, maxLength] = PASSWORD_LENGTH_RANGE
            if (value.length < minLength || value.length > maxLength) {
                throw new HttpException(422, errorMessage.DATA_VALIDATION_FAILED)
            }

            const salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS)
            const hash = bcrypt.hashSync(value, salt)
            this.setDataValue('password', hash)
        }
    })
    declare password: string

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.CUSTOMER
    })
    declare role: UserRole

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare isActive: boolean
}
