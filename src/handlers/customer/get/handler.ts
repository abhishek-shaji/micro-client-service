import { UnauthorizedException } from 'middy-exception-handler';
import { StatusCodes } from 'http-status-codes';
import { compose, createResponse } from '@abhishek-shaji/micro-common/utils';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';

import { findCustomerById } from '../../../services/customerService';
import { formatCustomer } from '../../../formatters/formatCustomer';

export const handleGetCustomer: AWSProxyHandler = async (event) => {
  const { customerId }: any = event.pathParameters;
  const secret = event.headers['x-customer-secret'];

  if (!secret) {
    throw new UnauthorizedException();
  }

  const customer = await findCustomerById(customerId);

  if (secret !== customer.token) {
    throw new UnauthorizedException('Invalid secret');
  }

  return createResponse(StatusCodes.OK, formatCustomer(customer));
};

export const handler = compose(
  validatePathParam('merchantId'),
  validatePathParam('customerId')
)(handleGetCustomer);
