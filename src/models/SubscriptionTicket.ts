import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IssuedSubscriptionTicketAttributes {
  ticketId: number;
  subscriptionTicketId: number;
  price: number;
  purchaseDate: Date;
  expiredAt: Date;
  paymentMethod: 'cash' | 'creditCard' | 'digitalWallet' | 'sfc';
  issuedStationId: number;
  code: string;
  paymentTime: Date;
}

type CreateIssuedSubscriptionTicketAttributes = Optional<
  IssuedSubscriptionTicketAttributes,
  'ticketId'
>;

@Table({
  tableName: 'issued_subscription_ticket',
  timestamps: false,
})
export default class IssuedSubscriptionTicket extends Model<
  IssuedSubscriptionTicketAttributes,
  CreateIssuedSubscriptionTicketAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare ticketId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare subscriptionTicketId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare purchaseDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiredAt: Date;

  @Column({
    type: DataType.ENUM('cash', 'creditCard', 'digitalWallet', 'sfc'),
    allowNull: false,
  })
  declare paymentMethod: 'cash' | 'creditCard' | 'digitalWallet' | 'sfc';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare issuedStationId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare paymentTime: Date;
}