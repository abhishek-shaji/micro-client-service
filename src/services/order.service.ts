import { AggregatePaginateResult } from 'mongoose';
import * as mongoose from 'mongoose';

import { UnauthorizedException } from '@abhishek-shaji/micro-common/exceptions';

import { Customer } from '../models/customer.model';
import { OrderModel } from '../models/order.model';

class OrderService {
  async validateToken(customerId, token?: string) {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const order = await OrderModel.findOne({
      customer: customerId,
      token,
    });

    if (!order) {
      throw new UnauthorizedException('Invalid token');
    }

    if (order.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }
  }

  async findCustomersByConfirmedOrders(
    merchantId: string,
    options: any
  ): Promise<AggregatePaginateResult<Customer>> {
    const results = await OrderModel.aggregatePaginate(
      OrderModel.aggregate([
        {
          $match: {
            status: {
              $ne: 'DRAFT',
            },
            customer: {
              $ne: null,
            },
            merchant: new mongoose.Types.ObjectId(merchantId),
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: {
            path: '$customer',
          },
        },
        {
          $lookup: {
            from: 'payments',
            localField: 'payment',
            foreignField: '_id',
            as: 'payment',
          },
        },
        {
          $unwind: {
            path: '$payment',
          },
        },
        {
          $lookup: {
            from: 'addresses',
            localField: 'customer.address',
            foreignField: '_id',
            as: 'customer.address',
          },
        },
        {
          $unwind: {
            path: '$customer.address',
          },
        },
        {
          $group: {
            _id: '$customer.email',
            customer: {
              $last: '$$ROOT.customer',
            },
            blikPaymentCount: {
              $sum: {
                $cond: [{ $eq: ['$payment.method', 'BLIK'] }, 1, 0],
              },
            },
            cardPaymentCount: {
              $sum: {
                $cond: [{ $eq: ['$payment.method', 'CARD'] }, 1, 0],
              },
            },
            cashPaymentCount: {
              $sum: {
                $cond: [{ $eq: ['$payment.method', 'CASH'] }, 1, 0],
              },
            },
            terminalPaymentCount: {
              $sum: {
                $cond: [{ $eq: ['$payment.method', 'TERMINAL'] }, 1, 0],
              },
            },
            totalSpend: {
              $sum: '$payment.total',
            },
            createdAt: {
              $first: '$$ROOT.customer.createdAt',
            },
            lastOrderedAt: {
              $last: '$$ROOT.createdAt',
            },
            orderCount: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            paymentMethodUsage: [
              {
                type: 'BLIK',
                count: '$blikPaymentCount',
              },
              {
                type: 'CASH',
                count: '$cashPaymentCount',
              },
              {
                type: 'TERMINAL',
                count: '$terminalPaymentCount',
              },
              {
                type: 'CARD',
                count: '$cardPaymentCount',
              },
            ],
          },
        },
        {
          $unset: [
            '_id',
            'blikPaymentCount',
            'cashPaymentCount',
            'terminalPaymentCount',
            'cardPaymentCount',
          ],
        },
      ]),
      options
    );

    return {
      ...results,
      docs: results.docs.map((result: any) => ({
        ...result,
        ...result.customer,
        customer: undefined,
      })),
    };
  }
}

export { OrderService };
