import { OrderModel } from '../models/Order';
import { AggregatePaginateResult } from 'mongoose';
import { Customer } from '../models/Customer';

class OrderService {
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
            _id: 'customer.email',
            customer: {
              $last: '$$ROOT.customer',
            },
            totalSpend: {
              $sum: '$payment.total',
            },
            orderCount: {
              $sum: 1,
            },
          },
        },
      ]),
      options
    );

    console.log(results);

    return {
      ...results,
      docs: results.docs.map((result: any) => ({
        ...result.customer,
        totalSpend: result.totalSpend,
        orderCount: result.orderCount,
      })),
    };
  }
}

export { OrderService };
