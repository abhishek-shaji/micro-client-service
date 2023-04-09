import { StatusCodes } from 'http-status-codes';

import { Response } from '@abhishek-shaji/micro-common/decorators';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';

@LambdaHandler()
class HealthCheck {
  @Response(StatusCodes.OK)
  async handler(): Promise<any> {
    const { version } = require('../../../package.json');

    return {
      version,
      healthy: true,
    };
  }
}

export default createLambda(HealthCheck);
