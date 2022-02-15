import '@abhishek-shaji/micro-common/models/Address';
import { StatusCodes } from 'http-status-codes';
import { compose, createResponse } from '@abhishek-shaji/micro-common/utils';
import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';
import { isGranted } from '@abhishek-shaji/micro-common/middlewares/isGranted';
import { validatePathParam } from '@abhishek-shaji/micro-common/middlewares/validatePathParam';
import { Namespace } from '@abhishek-shaji/micro-common/enum/Namespace';
import { AccessPermission } from '@abhishek-shaji/micro-common/enum/AccessPermission';

import { deleteVariant } from '../../../services/variantService';

export const handleUpdateVariant: AWSProxyHandler = async (event) => {
  const { variantId } = event.pathParameters;

  await deleteVariant(variantId);

  return createResponse(StatusCodes.OK, {
    code: 200,
    message: `Successfully archived variant #${variantId}`,
  });
};

export const handler = compose(
  validatePathParam('merchantId'),
  validatePathParam('variantId'),
  isGranted(Namespace.productList, AccessPermission.delete)
)(handleUpdateVariant);
