import { Document, model, Schema } from 'mongoose';
import mongooseIntl from 'mongoose-intl';

import { File } from '@abhishek-shaji/micro-common/models/File';

import { ModifierList } from './modifier-list.model';

class Modifier extends Document {
  name: string;
  description: string;
  sku: string;
  availableQuantity?: number;
  images: File[];
  modifierList: ModifierList;
  price: number;
}

const schema = new Schema<Modifier>(
  {
    name: {
      type: String,
      required: true,
      intl: true,
    },
    sku: {
      type: String,
      required: false,
    },
    price: { type: Number, required: true },
    availableQuantity: {
      type: Number,
      required: false,
    },
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

const ModifierModel = model<Modifier>('Modifier', schema);

export { Modifier, ModifierModel };
