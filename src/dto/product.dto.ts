import { FileDTO } from '@abhishek-shaji/micro-common/dto';

import { Product } from '../models/product.model';
import { ModifierListDTO } from './modifier-list.dto';

export class ProductDTO {
  id: string;
  name: string;
  description: string | undefined;
  content: string | undefined;
  slug: string;
  thumbnail: FileDTO;
  tags: string[] | undefined | string;
  basePrice: number;
  discountedBasePrice: number | undefined;
  availableQuantity: number | undefined;
  publishedAt: Date;
  currency: string;
  productCategories: { name: string; id: any }[];
  images: FileDTO[];
  modifierLists: any[];

  constructor(product: Product, locale?: string, showContent?: boolean) {
    const {
      _id,
      slug,
      thumbnail,
      tags,
      basePrice,
      discountedBasePrice,
      availableQuantity,
      images,
      modifierLists,
      currency,
      publishedAt,
      productCategories,
    } = product;

    this.id = _id;
    this.slug = slug;
    this.thumbnail = new FileDTO(thumbnail);
    this.tags = tags;
    this.basePrice = basePrice;
    this.discountedBasePrice = discountedBasePrice;
    this.availableQuantity = availableQuantity;
    this.publishedAt = publishedAt;
    this.currency = currency;
    this.productCategories = productCategories.map((productCategory) => {
      return {
        id: productCategory._id,
        name: productCategory.get(`name.${locale}`),
        slug: productCategory.slug,
      };
    });
    this.images = images && images.map((image) => new FileDTO(image));
    this.modifierLists = modifierLists?.length
      ? modifierLists.map(
          (modifierList) => new ModifierListDTO(modifierList, locale)
        )
      : [];

    if (locale) {
      this.name = product.get(`name.${locale}`);
      this.description = product.get(`description.${locale}`);
      this.content = showContent ? product.get(`content.${locale}`) : null;
    } else {
      const { name, description, content } =
        typeof product.toObject === 'function' ? product.toObject() : product;
      this.name = name;
      this.description = description;
      this.content = showContent ? content : null;
    }
  }
}
