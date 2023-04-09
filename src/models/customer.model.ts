import { AggregatePaginateModel, Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-aggregate-paginate-v2';
import ShortUniqueId from 'short-unique-id';

import { Address, Merchant } from '@abhishek-shaji/micro-common/models';

class Customer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address?: Address;
  merchant: Merchant;
  token: string;
}

const schema = new Schema<Customer>(
  {
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
      required: false,
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

const CustomerModel = model<Customer, AggregatePaginateModel<Customer>>(
  'Customer',
  schema
);

export { Customer, CustomerModel };
