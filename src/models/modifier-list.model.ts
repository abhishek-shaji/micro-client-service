import { Document, model, Schema } from 'mongoose';
import mongooseIntl from 'mongoose-intl';

import { Modifier } from './modifier.model';

class ModifierList extends Document {
  name: string;
  description: string;
  modifiers: Modifier[];
  selectMin: number;
  selectMax: number;
}

const schema = new Schema<ModifierList>(
  {
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
    selectMin: {
      type: Number,
      required: false,
    },
    selectMax: {
      type: Number,
      required: false,
    },
    modifiers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Modifier',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongooseIntl, { languages: ['en', 'pl'], defaultLanguage: 'en' });

schema.post('remove', async function (doc) {
  console.log('ModifierList %s has been removed', doc._id);
});

const ModifierListModel = model<ModifierList>('ModifierList', schema);

export { ModifierList, ModifierListModel };
