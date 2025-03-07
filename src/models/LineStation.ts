import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Line from '@/models/Line'
import Station from '@/models/Station'

interface LineStationAttributes {
    lineId: number
    stationId: number
    position: number
}

type CreateLineStationAttributes = LineStationAttributes

@Table({
    tableName: 'line_station',
    timestamps: false
})
export default class LineStation extends Model<LineStationAttributes, CreateLineStationAttributes> {
    @ForeignKey(() => Line)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    declare lineId: number

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    declare stationId: number

    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    declare position: number
}
