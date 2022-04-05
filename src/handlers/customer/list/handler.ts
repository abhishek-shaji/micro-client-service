import { StatusCodes } from 'http-status-codes';
import { compose } from '@abhishek-shaji/micro-common/utils';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';
import { isGranted } from '@abhishek-shaji/micro-common/middlewares/isGranted';
import { AccessPermission } from '@abhishek-shaji/micro-common/enum/AccessPermission';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';
import { createPaginatedResponse } from '@abhishek-shaji/micro-common/utils/createPaginatedResponse';
import { Namespace } from '@abhishek-shaji/micro-common/enum/Namespace';

import { formatCustomer } from '../../../formatters/formatCustomer';
import { OrderService } from '../../../services/OrderService';

export const handleGetCustomer: AWSProxyHandler = async (event) => {
  const { merchantId }: any = event.pathParameters;
  const { page = 1, limit = 10 }: any = event.queryStringParameters || {};

  const orderService = new OrderService();

  const result: any = await orderService.findCustomersByConfirmedOrders(merchantId, {
    page,
    limit,
  });

  return createPaginatedResponse(StatusCodes.OK, result, formatCustomer);
};

export const handler = compose(
  validatePathParam('merchantId'),
  isGranted(Namespace.customer, AccessPermission.read)
)(handleGetCustomer);
