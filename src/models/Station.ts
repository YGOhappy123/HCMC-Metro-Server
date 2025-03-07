import { Optional } from 'sequelize'
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import Staff from '@/models/Staff'
import Line from '@/models/Line'
import LineStation from '@/models/LineStation'

interface StationAttributes {
    stationId: number
    stationName: string
    location: string
}

type CreateStationAttributes = Optional<StationAttributes, 'stationId'>

@Table({
    tableName: 'station',
    timestamps: false
})
export default class Station extends Model<StationAttributes, CreateStationAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare stationId: number

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare stationName: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare location: string

    @HasMany(() => Staff, 'workingStationId')
    declare workingStaffs: Staff[]

    @BelongsToMany(() => Line, () => LineStation)
    declare lines: Line[]
}
