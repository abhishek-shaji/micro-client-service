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
import { MerchantService } from '../../services/merchant.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductService } from '../../services/product.service';

@LambdaHandler()
class GetLandingPageData {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly productService: ProductService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly contentService: ContentService
  ) {}

  @Response(StatusCodes.OK, undefined, true)
  async handler(
    @Header('accept-language') locale: string,
    @Param('merchantId', { isBsonId: true }) merchantId: string,
    @Query('modules') modules: string
  ): Promise<any> {
    const modulesArray = (modules || '').split(',');
    const response: any = {};

    if (modulesArray.includes('merchant')) {
      response['merchant'] = await this.merchantService.getMerchantById(
        merchantId
      );
    }

    if (modulesArray.includes('popularProducts')) {
      response.products = {};

      response.products.popular = await this.productService.getPopularProducts(
        merchantId,
        locale
      );
    }

    if (modulesArray.includes('saleProducts')) {
      if (response.products === undefined) {
        response.products = {};
      }

      response.products.sale = await this.productService.getProductsOnSale(
        merchantId,
        locale
      );
    }

    if (modulesArray.includes('productCategories')) {
      response.categories =
        await this.productCategoryService.getProductCategories(
          {
            merchant: merchantId,
            publishedAt: { $exists: true, $ne: null },
            deletedAt: { $exists: false },
          },
          locale
        );
    }

    if (modulesArray.includes('blogs')) {
      response.blogs = await this.contentService.getBlogsByMerchant(merchantId);
    }

    return response;
  }
}

export default createLambda(GetLandingPageData, [
  MerchantService,
  ProductService,
  ProductCategoryService,
  ContentService,
]);
