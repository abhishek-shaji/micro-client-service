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
import { ContentDTO } from '../../dto/content.dto';
import { ContentService } from '../../services/content.service';

@LambdaHandler()
class UnpublishContent {
  constructor(private readonly contentService: ContentService) {}

  @IsGranted(Namespace.product, AccessPermission.update)
  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Param('contentId', { isBsonId: true }) contentId: string
  ): Promise<any> {
    const contentSchema = await this.contentService.unpublish(
      merchantId,
      contentId
    );

    return new ContentDTO(contentSchema);
  }
}

export default createLambda(UnpublishContent, [ContentService]);
