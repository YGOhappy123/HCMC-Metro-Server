import { Optional } from 'sequelize'
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'
import LineStation from '@/models/LineStation'
import Station from '@/models/Station'

interface LineAttributes {
    lineId: number
    lineName: string
    distance: number
}

type CreateLineAttributes = Optional<LineAttributes, 'lineId'>

@Table({
    tableName: 'line',
    timestamps: false
})
export default class Line extends Model<LineAttributes, CreateLineAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare lineId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare lineName: string

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    declare distance: number

    @BelongsToMany(() => Station, () => LineStation)
    declare stations: Station[]
}
