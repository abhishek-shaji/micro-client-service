import { AWSProxyHandler } from '@abhishek-shaji/micro-common/types';

import { version } from '../../../package.json';

export const handler: AWSProxyHandler = async () => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      status: 'live',
      version: version,
    }),
  };
};
