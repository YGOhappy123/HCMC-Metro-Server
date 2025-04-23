import { ISearchParams } from '@/interfaces/params';
import { buildWhereStatement } from '@/utils/queryHelpers';
import SubscriptionTicket from '@/models/SubscriptionTicket';
import IssuedSubscriptionTicket from '@/models/IssuedSubscriptionTicket';
import Order from '@/models/Order';
import { TicketStatus } from '@/enums/ticket';
import { PaymentMethod } from '@/enums/ticket';

const ticketService = {
  getSubscriptionTickets: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
    const { count, rows: tickets } = await SubscriptionTicket.findAndCountAll({
      where: buildWhereStatement(filter),
      limit: limit,
      offset: skip,
      order: JSON.parse(sort),
    });

    return {
      tickets: tickets.map((ticket) => {
        const { ...ticketData } = ticket.toJSON();
        return {
          ...ticketData,
        };
      }),
      total: count,
    };
  },

  issueSubscriptionTicket: async (data: {
    subscriptionTicketId: number;
    price: number;
    issuedAt: string;
    expiredAt: string;
    issuedStationId?: number;
    code: string;
    paymentMethod: PaymentMethod;
    paymentTime: string;
  }) => {
    // try {
      // Kiểm tra subscriptionTicketId
      const subscriptionTicket = await SubscriptionTicket.findByPk(data.subscriptionTicketId);
      if (!subscriptionTicket) {
        throw new Error('Invalid subscription ticket ID');
      }

      // Tạo Order
      const order = await Order.create({
        paymentMethod: data.paymentMethod,
        paymentTime: new Date(data.paymentTime),
        total: data.price,
      });

      // Tạo IssuedSubscriptionTicket với orderId
      const ticket = await IssuedSubscriptionTicket.create({
        subscriptionTicketId: data.subscriptionTicketId,
        price: data.price,
        issuedAt: new Date(data.issuedAt),
        expiredAt: new Date(data.expiredAt),
        issuedStationId: data.issuedStationId,
        code: data.code,
        orderId: order.orderId,
        status: TicketStatus.UNPAID,
      });

      return {
        ticket: ticket.toJSON(),
        order: order.toJSON(),
        message: 'Ticket issued successfully',
      };
//     } catch (error: Error) {
//       console.error('Error issuing subscription ticket:', error);
//       throw new Error(error.message || 'Failed to issue subscription ticket');
//     }
  },
};

export default ticketService;