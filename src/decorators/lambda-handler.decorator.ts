import { LambdaHandler as CreateLambdaHandler } from '@abhishek-shaji/micro-common/decorators';

import { logger } from '../utils/logger.util';

export function LambdaHandler() {
  return CreateLambdaHandler(logger);
}
