import { Document, model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Merchant } from '@abhishek-shaji/micro-common/models';

import { ContentSchemaConfig } from '../types/content';
import { validateConfig } from '../utils/validateConfig.util';

class ContentSchema extends Document {
  title: string;
  apiIdentifier: string;
  description?: string;
  config: ContentSchemaConfig;
  merchant: Merchant;
}

const schema = new Schema<ContentSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    apiIdentifier: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    config: {
      type: Schema.Types.Mixed,
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre<ContentSchema>('save', async function (next) {
  await validateConfig(this.config);

  next();
});

schema.plugin(mongoosePaginate);

const ContentSchemaModel = model<ContentSchema, PaginateModel<ContentSchema>>(
  'ContentSchema',
  schema
);

export { ContentSchema, ContentSchemaModel };
