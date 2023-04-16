import mongoose from 'mongoose';

import { ProductDTO } from '../dto/product.dto';
import { OrderStatus } from '../enums/order-status.enum';
import '../models/modifier-list.model';
import '../models/modifier.model';
import { OrderModel } from '../models/order.model';
import { ProductModel } from '../models/product.model';

class ProductService {
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
    }).populate([
      {
        path: 'modifierLists',
        populate: {
          path: 'modifiers',
        },
      },
      {
        path: 'thumbnail',
      },
      {
        path: 'images',
      },
    ]);

    return productModel.map((product) => new ProductDTO(product, locale));
  }

  async getProductsOnSale(merchantId: string, locale: string) {
    const productModel = await ProductModel.find({
      merchant: merchantId,
      publishedAt: { $exists: true, $ne: null },
      discountedBasePrice: { $exists: true, $ne: null },
      deletedAt: { $exists: false },
    }).populate([
      {
        path: 'modifierLists',
        populate: {
          path: 'modifiers',
        },
      },
      {
        path: 'thumbnail',
      },
      {
        path: 'images',
      },
    ]);

    return productModel.map((product) => new ProductDTO(product, locale));
  }
}

export { ProductService };
