import * as mongoose from 'mongoose';
import { NotFoundException } from 'middy-exception-handler';

import { CustomerModel, Customer } from '../models/Customer';
import { AddressModel } from '@abhishek-shaji/micro-common/models/Address';
import { AggregatePaginateResult } from 'mongoose';

class CustomerService {
  async findCustomerById(customerId: string, populate = 'address') {
    const customer = await CustomerModel.findById(customerId).populate(populate);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async createCustomer({ address, ...restData }: any) {
    const addressDocument = new AddressModel(address);
    await addressDocument.save();

    const customer = new CustomerModel({ ...restData, address: addressDocument._id });

    await customer.save();

    return customer.populate('address');
  }

  async updateCustomer(customer: Customer, { address, ...restData }: any) {
    const addressDocument = await AddressModel.findById(customer.address._id);
    addressDocument.$set(address);
    await addressDocument.save();

    customer.$set(restData);
    await customer.save();

    customer.address = addressDocument;

    return customer;
  }

  async deleteCustomer(customerId: string) {
    const customer = await this.findCustomerById(customerId, '');

    await customer.remove();
  }

  async getCustomersByMerchantId(
    merchantId: string,
    options: any
  ): Promise<AggregatePaginateResult<Customer>> {
    const results = await CustomerModel.aggregatePaginate(
      CustomerModel.aggregate([
        {
          $match: { merchant: new mongoose.Types.ObjectId(merchantId) },
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: { from: 'addresses', localField: 'address', foreignField: '_id', as: 'address' },
        },
        { $unwind: '$address' },
        { $group: { _id: '$email', user: { $last: '$$ROOT' } } },
      ]),
      options
    );

    return {
      ...results,
      docs: results.docs.map((result: any) => result.user),
    };
  }
}

export { CustomerService };
