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
import { ContentSchemaSchema } from '../../schemas/content-schema.schema';
import { ContentSchemaService } from '../../services/content-schema.service';

@LambdaHandler()
class DeleteContentSchema {
  constructor(private readonly contentSchema: ContentSchemaService) {}

  @IsGranted(Namespace.product, AccessPermission.create)
  @Response(StatusCodes.OK)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Body(ContentSchemaSchema) body: ContentSchemaSchema
  ): Promise<any> {
    await this.contentSchema.delete(merchantId, contentSchemaId);

    return {
      message: 'Content schema deleted successfully',
    };
  }
}

export default createLambda(DeleteContentSchema, [ContentSchemaService]);
