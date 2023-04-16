import { FileDTO } from '@abhishek-shaji/micro-common/dto';

import { ProductCategory } from '../models/product-category.model';
import { ProductDTO } from './product.dto';

export class ProductCategoryDTO {
  id: string;
  slug: string;
  publishedAt: Date;
  thumbnail?: FileDTO;
  productCount: number;
  products: any[] | undefined;
  name: string | undefined;
  description: string | null | undefined;

  constructor(
    productCategory: ProductCategory,
    locale?: string,
    shouldFormatProducts?: boolean
  ) {
    const { _id, slug, products, publishedAt, thumbnail, productCount } =
      productCategory as any;

    this.id = _id;
    this.slug = slug;
    this.publishedAt = publishedAt;
    this.thumbnail = thumbnail ? new FileDTO(thumbnail) : undefined;
    this.productCount = productCount;
    this.products =
      products &&
      shouldFormatProducts &&
      products.map((product) => new ProductDTO(product, locale));

    if (locale) {
      const isTranslatable = typeof productCategory.get === 'function';
      this.name = isTranslatable
        ? productCategory.get(`name.${locale}`)
        : productCategory.name[locale];
      this.description = isTranslatable
        ? productCategory.get(`description.${locale}`)
        : productCategory.description
        ? productCategory.description[locale]
        : null;
    } else {
      const { name, description } =
        typeof productCategory.toObject === 'function'
          ? productCategory.toObject()
          : productCategory;
      this.name = name;
      this.description = description;
    }
  }
}
