import mongoose from 'mongoose';

import { NotFoundException } from '@abhishek-shaji/micro-common/exceptions';
import { createPaginatedResponse } from '@abhishek-shaji/micro-common/utils';

import { ProductCategoryDTO } from '../dto/product-category.dto';
import { ProductDTO } from '../dto/product.dto';
import { OrderStatus } from '../enums/order-status.enum';
import '../models/modifier-list.model';
import '../models/modifier.model';
import { OrderModel } from '../models/order.model';
import '../models/product-category.model';
import { ProductCategoryModel } from '../models/product-category.model';
import { ProductModel } from '../models/product.model';

class ProductService {
  private defaultPopulate = [
    {
      path: 'modifierLists',
      populate: {
        path: 'modifiers',
      },
    },
    {
      path: 'productCategories',
    },
    {
      path: 'thumbnail',
    },
    {
      path: 'images',
    },
  ];

  async getPopularProductIds(merchantId: string): Promise<string[]> {
    const result = await OrderModel.aggregate([
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(merchantId),
          status: { $ne: OrderStatus.draft },
        },
      },
      {
        $lookup: {
          from: 'orderitems',
          localField: 'orderItems',
          foreignField: '_id',
          as: 'order-items-lookup',
        },
      },
      {
        $unwind: {
          path: '$order-items-lookup',
        },
      },
      {
        $group: {
          _id: '$order-items-lookup.product.id',
          name: {
            $first: '$order-items-lookup.product.name',
          },
          thumbnail: {
            $first: '$order-items-lookup.product.thumbnail',
          },
          quantitiesSold: {
            $sum: '$order-items-lookup.quantity',
          },
          revenue: {
            $sum: '$order-items-lookup.totalPrice',
          },
        },
      },
      {
        $sort: {
          quantitiesSold: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return result.map(({ _id }: any) => _id);
  }

  async getPopularProducts(merchantId: string, locale: string) {
    const productIds = await this.getPopularProductIds(merchantId);

    const productModel = await ProductModel.find({
      _id: { $in: productIds },
      merchant: merchantId,
      publishedAt: { $exists: true, $ne: null },
      deletedAt: { $exists: false },
    }).populate(this.defaultPopulate);

    return productModel.map((product) => new ProductDTO(product, locale));
  }

  async getProductsOnSale(merchantId: string, locale: string) {
    const productModel = await ProductModel.find({
      merchant: merchantId,
      publishedAt: { $exists: true, $ne: null },
      discountedBasePrice: { $exists: true, $ne: null },
      deletedAt: { $exists: false },
    }).populate(this.defaultPopulate);

    return productModel.map((product) => new ProductDTO(product, locale));
  }

  async getProduct(merchantId: string, productId: string, locale: string) {
    const product = await ProductModel.findOne({
      _id: productId,
      merchant: merchantId,
      publishedAt: { $exists: true, $ne: null },
    }).populate(this.defaultPopulate);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return new ProductDTO(product, locale);
  }

  async searchProducts(merchantId: string, query: string, locale: string) {
    const result = await ProductModel.find({
      merchant: merchantId,
      publishedAt: { $exists: true, $ne: null },
      deletedAt: { $exists: false },
      $or: [
        { 'name.en': { $regex: query, $options: 'i' } },
        { 'name.pl': { $regex: query, $options: 'i' } },
      ],
    })
      .populate(this.defaultPopulate)
      .limit(10);

    return result.map((product) => ({
      id: product._id,
      name: product.get(`name.${locale}`),
    }));
  }

  async getProductsByCategory(
    merchantId: string,
    categorySlug: string | undefined,
    locale: string,
    options: any
  ) {
    const category = await ProductCategoryModel.findOne({
      merchant: merchantId,
      slug: categorySlug,
    });

    const result = await ProductModel.paginate(
      {
        merchant: merchantId,
        publishedAt: { $exists: true, $ne: null },
        deletedAt: { $exists: false },
        ...(category ? { productCategories: category._id } : {}),
      },
      {
        populate: this.defaultPopulate,
        ...options,
      }
    );

    return {
      products: createPaginatedResponse({
        ...result,
        docs: result.docs.map((product) => new ProductDTO(product, locale)),
      }),
      category: category ? new ProductCategoryDTO(category, locale) : null,
    };
  }
}

export { ProductService };
