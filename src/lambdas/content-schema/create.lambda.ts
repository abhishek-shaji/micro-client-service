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
class CreateContentSchema {
  constructor(private readonly contentSchema: ContentSchemaService) {}

  @IsGranted(Namespace.product, AccessPermission.create)
  @Response(StatusCodes.CREATED)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Body(ContentSchemaSchema) body: ContentSchemaSchema
  ): Promise<any> {
    const contentSchema = await this.contentSchema.create({
      ...body,
      merchant: merchantId,
    });

    return new ContentSchemaDTO(contentSchema);
  }
}

export default createLambda(CreateContentSchema, [ContentSchemaService]);
