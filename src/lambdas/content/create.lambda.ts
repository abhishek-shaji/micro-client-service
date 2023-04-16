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
class CreateContent {
  public user: User;
  constructor(private readonly contentSchema: ContentService) {}

  @IsGranted(Namespace.product, AccessPermission.create)
  @Response(StatusCodes.CREATED)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Body(ContentSchema) body: ContentSchema
  ): Promise<any> {
    const contentSchema = await this.contentSchema.create(
      merchantId,
      contentSchemaId,
      this.user.profile.firstname,
      body
    );

    return new ContentDTO(contentSchema);
  }
}

export default createLambda(CreateContent, [ContentService]);
