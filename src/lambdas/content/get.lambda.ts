import { StatusCodes } from 'http-status-codes';

import {
  Header,
  Param,
  Response,
  Query,
} from '@abhishek-shaji/micro-common/decorators';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ContentService } from '../../services/content.service';

@LambdaHandler()
class GetContent {
  constructor(private readonly contentService: ContentService) {}

  @Response(StatusCodes.OK, undefined, true)
  async handler(
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Query('apiIdentifiers') apiIdentifiers: string,
    @Query('limit') limit: string
  ): Promise<any> {
    const apiIdentifiersArr = (apiIdentifiers || '').split(',');

    return this.contentService.getContentByContentIds(
      merchantId,
      apiIdentifiersArr,
      Number(limit)
    );
  }
}

export default createLambda(GetContent, [ContentService]);
