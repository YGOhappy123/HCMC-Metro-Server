import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Station from '@/models/Station'

interface SfcCardAttributes {
    sfcCardId: number
    code: string
    issuedStationId: number
    balance: number
    isActive: boolean
    issuedAt: Date
}

type CreateSfcCardAttributes = Optional<SfcCardAttributes, 'sfcCardId' | 'isActive'>

const SFC_CARD_CODE_LENGTH_RANGE = [16, 16] as const

@Table({
    tableName: 'issued_sfc_card',
    timestamps: false
})
export default class SfcCard extends Model<SfcCardAttributes, CreateSfcCardAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare sfcCardId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
        validate: { len: SFC_CARD_CODE_LENGTH_RANGE }
    })
    declare code: string

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare issuedStationId: number

    @BelongsTo(() => Station, 'issuedStationId')
    declare issuedStation: Station

    @Column({
        type: DataType.DOUBLE,
        allowNull: false,
        validate: { min: 0 }
    })
    declare balance: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare isActive: boolean

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare issuedAt: Date
}
