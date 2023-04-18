import { StatusCodes } from 'http-status-codes';

import {
  Header,
  Param,
  Query,
  Response,
} from '@abhishek-shaji/micro-common/decorators';
import { createLambda } from '@abhishek-shaji/micro-common/utils';

import { LambdaHandler } from '../../decorators/lambda-handler.decorator';
import { ProductService } from '../../services/product.service';

@LambdaHandler()
class SearchProducts {
  constructor(private readonly productService: ProductService) {}

  @Response(StatusCodes.OK, undefined, true)
  async handler(
    @Header('accept-language') locale: string,
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Query('query') query: string = ''
  ): Promise<any> {
    if (!query || query.length < 2) {
      return [];
    }

    return this.productService.searchProducts(merchantId, query, locale);
  }
}

export default createLambda(SearchProducts, [ProductService]);
