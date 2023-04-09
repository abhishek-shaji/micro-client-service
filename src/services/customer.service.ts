import * as mongoose from 'mongoose';
import { AggregatePaginateResult } from 'mongoose';

import { NotFoundException } from '@abhishek-shaji/micro-common/exceptions';

import { CustomerModel, Customer } from '../models/customer.model';
import { AddressService } from './address.service';

class CustomerService {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  async findCustomerById(
    customerId: string,
    populate = 'address'
  ): Promise<any> {
    const customer = await CustomerModel.findById(customerId).populate(
      populate
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async createCustomer({ address, ...restData }: any) {
    const addressDocument = address
      ? await this.addressService.create(address)
      : undefined;

    const customer = new CustomerModel({
      ...restData,
      address: addressDocument?._id,
    });

    await customer.save();

    return customer.populate('address');
  }

  async updateCustomer(customer: Customer, { address, ...restData }: any) {
    let addressDocument = null;

    if (address) {
      addressDocument = customer.address?._id
        ? await this.addressService.update(customer.address._id, address)
        : await this.addressService.create(address);
    }

    customer.$set({
      ...restData,
      address: addressDocument,
    });

    await customer.save();

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
          $lookup: {
            from: 'addresses',
            localField: 'address',
            foreignField: '_id',
            as: 'address',
          },
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
