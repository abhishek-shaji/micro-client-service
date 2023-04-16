import { StatusCodes } from 'http-status-codes';

import {
  Body,
  Param,
  Response,
  IsGranted,
} from '@abhishek-shaji/micro-common/decorators';
import {
  AccessPermission,
  Namespace,
} from '@abhishek-shaji/micro-common/enums';
import { User } from '@abhishek-shaji/micro-common/models';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ContentDTO } from '../../dto/content.dto';
import { ContentSchema } from '../../schemas/content.schema';
import { ContentService } from '../../services/content.service';

@LambdaHandler()
class PublishContent {
  public user: User;

  constructor(private readonly contentService: ContentService) {}

  @IsGranted(Namespace.product, AccessPermission.update)
  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Param('contentId', { isBsonId: true }) contentId: string
  ): Promise<any> {
    const contentSchema = await this.contentService.publish(
      merchantId,
      contentId,
      this.user
    );

    return new ContentDTO(contentSchema);
  }
}

export default createLambda(PublishContent, [ContentService]);
