import { StatusCodes } from 'http-status-codes';

import {
  Param,
  Response,
  IsGranted,
} from '@abhishek-shaji/micro-common/decorators';
import {
  AccessPermission,
  Namespace,
} from '@abhishek-shaji/micro-common/enums';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ContentService } from '../../services/content.service';

@LambdaHandler()
class DeleteContent {
  constructor(private readonly contentService: ContentService) {}

  @IsGranted(Namespace.product, AccessPermission.delete)
  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Param('contentId', { isBsonId: true }) contentId: string
  ): Promise<any> {
    return this.contentService.delete(merchantId, contentSchemaId, contentId);
  }
}

export default createLambda(DeleteContent, [ContentService]);
