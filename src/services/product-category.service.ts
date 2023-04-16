import mongoose, { FilterQuery } from 'mongoose';

import { ProductCategoryDTO } from '../dto/product-category.dto';
import {
  ProductCategory,
  ProductCategoryModel,
} from '../models/product-category.model';

class ProductCategoryService {
  public async getProductCategories(
    filter: FilterQuery<ProductCategory>,
    locale: string
  ): Promise<ProductCategoryDTO[]> {
    const categories = await ProductCategoryModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'productCategories',
          as: 'products',
        },
      },
      {
        $match: {
          merchant: new mongoose.Types.ObjectId(filter.merchant),
          publishedAt: { $exists: true, $ne: null },
          deletedAt: { $exists: false },
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: 'thumbnail',
          foreignField: '_id',
          as: 'thumbnail',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          slug: 1,
          merchant: 1,
          thumbnail: { $arrayElemAt: ['$thumbnail', 0] },
          publishedAt: 1,
          deletedAt: 1,
          deletedBy: 1,
          publishedBy: 1,
          productCount: { $size: '$products' },
        },
      },
    ]);

    return categories.map(
      (category) => new ProductCategoryDTO(category, locale)
    );
  }
}

export { ProductCategoryService };
