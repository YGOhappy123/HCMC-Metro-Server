import { Optional } from 'sequelize'
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { PaymentMethod } from '@/models/Payment'
import Admin from '@/models/Admin'
import Station from '@/models/Station'

interface SingleJourneyPriceAttributes {
    priceId: number
    firstStationId: number
    secondStationId: number
    paymentMethod: PaymentMethod
    price: number
    updatedAt: Date
    updatedBy: number
}

type CreateSingleJourneyPriceAttributes = Optional<SingleJourneyPriceAttributes, 'priceId' | 'updatedAt'>

@Table({
    tableName: 'single_journey_price',
    timestamps: false
})
export default class SingleJourneyPrice extends Model<SingleJourneyPriceAttributes, CreateSingleJourneyPriceAttributes> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare priceId: number

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare firstStationId: number

    @BelongsTo(() => Station, 'firstStationId')
    declare firstStation: Station

    @ForeignKey(() => Station)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare secondStationId: number

    @BelongsTo(() => Station, 'secondStationId')
    declare secondStation: Station

    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false,
        defaultValue: PaymentMethod.CASH
    })
    declare paymentMethod: PaymentMethod

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
    declare updatedAt: Date

    @ForeignKey(() => Admin)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare updatedBy: number

    @BelongsTo(() => Admin, 'updatedBy')
    declare updatedByAdmin: Admin
}
