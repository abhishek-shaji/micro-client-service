import { Document, model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Merchant } from '@abhishek-shaji/micro-common/models';

import { validateContent } from '../utils/validateContent.util';
import { ContentSchema } from './content-schema.model';

class Content extends Document {
  data: any;
  author: string;
  merchant: Merchant;
  contentSchema: ContentSchema;
  publishedAt?: Date;
}

const schema = new Schema<Content>(
  {
    author: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    contentSchema: {
      type: Schema.Types.ObjectId,
      ref: 'ContentSchema',
      required: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre<Content>('save', async function (next) {
  await this.populate('contentSchema');
  await validateContent(this.contentSchema.config, this.data);

  next();
});

schema.plugin(mongoosePaginate);

const ContentModel = model<Content, PaginateModel<Content>>('Content', schema);

export { Content, ContentModel };
