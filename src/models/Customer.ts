import { Document, model, PaginateModel, Schema } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@abhishek-shaji/micro-common/models/User';
import {
  deletionTrait,
  onDelete,
  onRecover,
} from '@abhishek-shaji/micro-common/traits/DeletionTrait';
import { publisherTrait } from '@abhishek-shaji/micro-common/traits/PublisherTrait';
import { Address } from '@abhishek-shaji/micro-common/models/Address';
import { Merchant } from '@abhishek-shaji/micro-common/models/Merchant';

class Customer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address: Address;
  merchant: Merchant;
  token: string;

  deletedAt: Date;
  deletedBy: User;
}

const schema = new Schema<Customer>(
  {
    ...deletionTrait,
    ...publisherTrait,
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
    token: {
      type: String,
      required: true,
      default: () => {
        const uid = new ShortUniqueId({ length: 45 });

        return uid();
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

schema.static('archive', onDelete);
schema.static('recover', onRecover);

const CustomerModel = model<Customer, PaginateModel<Customer>>('Customer', schema);

export { Customer, CustomerModel };
