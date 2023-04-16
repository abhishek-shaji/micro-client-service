import {
  Document,
  model,
  PaginateModel,
  Schema,
  SchemaOptions,
} from 'mongoose';
import mongooseIntl from 'mongoose-intl';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Currency } from '@abhishek-shaji/micro-common/enums';
import { File, Merchant, User } from '@abhishek-shaji/micro-common/models';
import {
  deletionTrait,
  onDelete,
  onRecover,
  publisherTrait,
  onPublish,
  onUnPublish,
} from '@abhishek-shaji/micro-common/traits';

import { ModifierList } from './modifier-list.model';
import { ProductCategory } from './product-category.model';

class Product extends Document {
  name: string;
  description: string;
  content: string;
  slug: string;
  sku: string;
  thumbnail: File;
  tags: string;
  images: File[];
  basePrice: number;
  discountedBasePrice?: number;
  availableQuantity?: number;
  currency: Currency;
  modifierLists: ModifierList[];
  merchant: Merchant;
  productCategories: ProductCategory[];
  _previousProductCategories: ProductCategory[];

  publishedAt: Date;
  publishedBy: User;
  deletedAt: Date;
  deletedBy: User;
}

const schema = new Schema<Product>(
  {
    ...deletionTrait,
    ...publisherTrait,
    name: {
      type: String,
      required: true,
      intl: true,
    },
    description: {
      type: String,
      required: true,
      intl: true,
    },
    content: {
      type: String,
      required: false,
      intl: true,
    },
    sku: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    discountedBasePrice: {
      type: Number,
      required: false,
    },
    availableQuantity: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    productCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: true,
        set<K extends keyof SchemaOptions>(
          productCategories: K,
          value: SchemaOptions[K],
          _tags?: any
        ) {
          this._previousProductCategories = this.productCategories || [];
          return productCategories || [];
        },
      },
    ],
    modifierLists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ModifierList',
        required: false,
      },
    ],
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongooseIntl, { languages: ['en', 'pl'], defaultLanguage: 'en' });
schema.plugin(mongoosePaginate);

schema.static('publish', onPublish);
schema.static('unpublish', onUnPublish);
schema.static('archive', onDelete);
schema.static('recover', onRecover);

const ProductModel = model<Product, PaginateModel<Product>>('Product', schema);

export { Product, ProductModel };
