import { Document, model, PaginateModel, Schema } from 'mongoose';
import mongooseIntl from 'mongoose-intl';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Merchant, User } from '@abhishek-shaji/micro-common/models';
import { File } from '@abhishek-shaji/micro-common/models/File';
import {
  deletionTrait,
  publisherTrait,
} from '@abhishek-shaji/micro-common/traits';

import { Product } from './product.model';

class ProductCategory extends Document {
  name: string;
  description: string;
  slug: string;
  merchant: Merchant;
  products: Product[];
  thumbnail?: File;

  publishedAt: Date;
  deletedAt: Date;
  deletedBy: User;
  publishedBy: User;
}

const schema = new Schema<ProductCategory>(
  {
    ...publisherTrait,
    ...deletionTrait,
    name: {
      type: String,
      required: true,
      intl: true,
    },
    description: {
      type: String,
      required: false,
      intl: true,
    },
    slug: {
      type: String,
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    thumbnail: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongooseIntl, { languages: ['en', 'pl'], defaultLanguage: 'en' });
schema.plugin(mongoosePaginate);

schema.post('remove', async function (doc) {
  console.log('ProductCategory %s has been removed', doc._id);
});

const ProductCategoryModel = model<
  ProductCategory,
  PaginateModel<ProductCategory>
>('ProductCategory', schema);

export { ProductCategory, ProductCategoryModel };
