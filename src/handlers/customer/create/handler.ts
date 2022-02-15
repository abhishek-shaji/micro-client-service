import { StatusCodes } from 'http-status-codes';
import { validateRequestBody } from '@abhishek-shaji/micro-common/middlewares';
import { compose, createResponse } from '@abhishek-shaji/micro-common/utils';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';

import { formatCustomer } from '../../../formatters/formatCustomer';
import { createCustomer } from '../../../services/customerService';
import { customerSchema } from '../../../validators/customerSchema';

export const handleCreateCustomer: AWSProxyHandler = async (event) => {
  const { merchantId }: any = event.pathParameters;
  const { firstname, lastname, email, phoneNumber, address }: any = event.body;

  const customer = await createCustomer({
    firstname,
    lastname,
    address,
    email,
    phoneNumber,
    merchant: merchantId,
  });

  return createResponse(StatusCodes.CREATED, {
    secret: customer.secret,
    customer: formatCustomer(customer),
  });
};

export const handler = compose(
  validatePathParam('merchantId'),
  validateRequestBody(customerSchema)
)(handleCreateCustomer);
