import { StatusCodes } from 'http-status-codes';

import {
  Body,
  Param,
  Response,
  IsGranted,
  Query,
} from '@abhishek-shaji/micro-common/decorators';
import {
  AccessPermission,
  Namespace,
} from '@abhishek-shaji/micro-common/enums';
import {
  createLambda,
  createPaginatedResponse,
} from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ContentSchemaDTO } from '../../dto/content-schema.dto';
import { ContentSchemaService } from '../../services/content-schema.service';

@LambdaHandler()
class GetContentSchemaList {
  constructor(private readonly contentSchema: ContentSchemaService) {}

  @IsGranted(Namespace.product, AccessPermission.read)
  @Response(StatusCodes.OK, createPaginatedResponse)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<any> {
    const list = await this.contentSchema.list(merchantId, {
      page,
      limit,
    });

    return {
      ...list,
      docs: list.docs.map(
        (contentSchema) => new ContentSchemaDTO(contentSchema)
      ),
    };
  }
}

export default createLambda(GetContentSchemaList, [ContentSchemaService]);
