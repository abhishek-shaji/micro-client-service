import { FilterQuery, PaginateDocument, PaginateResult } from 'mongoose';
import { NotFoundException } from 'middy-exception-handler';

import { CustomerModel, Customer } from '../models/Customer';
import { AddressModel } from '@abhishek-shaji/micro-common/models/Address';

export const findCustomerById = async (
  customerId: string,
  populate = 'address'
): Promise<Customer> => {
  const customer = await CustomerModel.findById(customerId).populate(populate);

  if (!customer) {
    throw new NotFoundException('Customer not found');
  }

  return customer;
};

export const createCustomer = async ({ address, ...restData }: any): Promise<Customer> => {
  const addressDocument = new AddressModel(address);
  await addressDocument.save();

  const customer = new CustomerModel({ ...restData, address: addressDocument._id });

  await customer.save();

  return customer.populate('address');
};

export const updateCustomer = async (
  customer: Customer,
  { address, ...restData }: any
): Promise<Customer> => {
  const addressDocument = await AddressModel.findById(customer.address._id);
  addressDocument.$set(address);
  await addressDocument.save();

  customer.$set(restData);
  await customer.save();

  customer.address = addressDocument;

  return customer;
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  const customer = await findCustomerById(customerId, '');

  await customer.remove();
};

export const getCustomers = async (
  filter: FilterQuery<Customer>,
  options: any
): Promise<PaginateResult<PaginateDocument<Customer, any, any>>> =>
  CustomerModel.paginate(filter, { populate: 'address', ...options });
