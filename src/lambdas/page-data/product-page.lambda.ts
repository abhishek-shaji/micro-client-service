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
class GetLandingPageProducts {
  constructor(private readonly productService: ProductService) {}

  @Response(StatusCodes.OK, undefined, true)
  async handler(
    @Header('accept-language') locale: string,
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Param('productId') productId: string
  ): Promise<any> {
    return this.productService.getProduct(merchantId, productId, locale);
  }
}

export default createLambda(GetLandingPageProducts, [ProductService]);
