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
import { ContentDTO } from '../../dto/content.dto';
import { ContentService } from '../../services/content.service';

@LambdaHandler()
class GetContentList {
  constructor(private readonly contentService: ContentService) {}

  @IsGranted(Namespace.product, AccessPermission.read)
  @Response(StatusCodes.OK, createPaginatedResponse)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('contentSchemaId', { isBsonId: true }) contentSchemaId: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<any> {
    const list = await this.contentService.list(merchantId, contentSchemaId, {
      page,
      limit,
    });

    return {
      ...list,
      docs: list.docs.map((item) => new ContentDTO(item)),
    };
  }
}

export default createLambda(GetContentList, [ContentService]);
