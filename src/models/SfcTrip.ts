import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Station from '@/models/Station'

interface SfcTripAttributes {
    sfcTripId: number
    sfcCardId: number
    entryStationId: number
    exitStationId: number
    price: number
    entryTime: Date
    exitTime: Date
}

type CreateSfcTripAttributes = Optional<SfcTripAttributes, 'sfcTripId' | 'exitStationId' | 'exitTime'>

@Table({
    tableName: 'sfc_trip',
    timestamps: false
})
export default class SfcTrip extends Model<SfcTripAttributes, CreateSfcTripAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare sfcTripId: number

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare entryStationId: number

    @BelongsTo(() => Station, 'entryStationId')
    declare entryStation: Station

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER
    })
    declare exitStationId: number

    @BelongsTo(() => Station, 'exitStationId')
    declare exitStation: Station

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
    declare entryTime: Date

    @Column({
        type: DataType.DATE
    })
    declare exitTime: Date
}
