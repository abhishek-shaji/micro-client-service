import { StatusCodes } from 'http-status-codes';
import { UnauthorizedException } from 'middy-exception-handler';
import { validateRequestBody } from '@abhishek-shaji/micro-common/middlewares';
import { compose, createResponse } from '@abhishek-shaji/micro-common/utils';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';

import { formatCustomer } from '../../../formatters/formatCustomer';
import { CustomerService } from '../../../services/CustomerService';
import { customerSchema } from '../../../validators/customerSchema';

export const handleUpdateCustomer: AWSProxyHandler = async (event) => {
  const { customerId } = event.pathParameters;
  const { firstname, lastname, email, phoneNumber, address }: any = event.body;
  const secret = event.headers['x-customer-secret'];

  if (!secret) {
    throw new UnauthorizedException();
  }

  const customerService = new CustomerService();

  const customer = await customerService.findCustomerById(customerId);

  if (secret !== customer.token) {
    throw new UnauthorizedException('Invalid secret');
  }

  const updated = await customerService.updateCustomer(customer, {
    firstname,
    lastname,
    email,
    phoneNumber,
    address,
  });

  return createResponse(StatusCodes.OK, formatCustomer(updated));
};

export const handler = compose(
  validatePathParam('merchantId'),
  validatePathParam('customerId'),
  validateRequestBody(customerSchema)
)(handleUpdateCustomer);
