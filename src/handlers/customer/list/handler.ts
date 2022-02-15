import { StatusCodes } from 'http-status-codes';
import { compose } from '@abhishek-shaji/micro-common/utils';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';
import { isGranted } from '@abhishek-shaji/micro-common/middlewares/isGranted';
import { AccessPermission } from '@abhishek-shaji/micro-common/enum/AccessPermission';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';
import { createPaginatedResponse } from '@abhishek-shaji/micro-common/utils/createPaginatedResponse';
import { Namespace } from '@abhishek-shaji/micro-common/enum/Namespace';

import { formatCustomer } from '../../../formatters/formatCustomer';
import { getCustomers } from '../../../services/customerService';

export const handleGetCustomer: AWSProxyHandler = async (event) => {
  const { merchantId }: any = event.pathParameters;
  const { page = 1, limit = 10 }: any = event.queryStringParameters || {};
  const customers = await getCustomers({ merchant: merchantId }, { page, limit });

  return createPaginatedResponse(StatusCodes.OK, customers, formatCustomer);
};

export const handler = compose(
  validatePathParam('merchantId'),
  isGranted(Namespace.customerList, AccessPermission.read)
)(handleGetCustomer);
