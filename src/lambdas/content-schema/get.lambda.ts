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
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ContentSchemaDTO } from '../../dto/content-schema.dto';
import { ContentSchemaService } from '../../services/content-schema.service';

@LambdaHandler()
class GetContentSchema {
  constructor(private readonly contentSchema: ContentSchemaService) {}

  @IsGranted(Namespace.product, AccessPermission.read)
  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string
  ): Promise<any> {
    const contentSchema = await this.contentSchema.get(
      merchantId,
      contentSchemaId
    );

    return new ContentSchemaDTO(contentSchema);
  }
}

export default createLambda(GetContentSchema, [ContentSchemaService]);
