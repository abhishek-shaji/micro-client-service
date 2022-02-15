import { Document, model, PaginateModel, Schema, SchemaOptions } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from '@abhishek-shaji/micro-common/models/User';
import {
  deletionTrait,
  onDelete,
  onRecover,
} from '@abhishek-shaji/micro-common/traits/DeletionTrait';
import {
  publisherTrait,
  onPublish,
  onUnPublish,
} from '@abhishek-shaji/micro-common/traits/PublisherTrait';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Address } from '@abhishek-shaji/micro-common/models/Address';
import { Merchant } from '@abhishek-shaji/micro-common/models/Merchant';
import { randomUUID } from 'crypto';

class Customer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  address: Address;
  merchant: Merchant;
  secret: string;

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
      ref: 'Mercahnt',
      required: true,
    },
    secret: {
      type: String,
      required: true,
      default: () => Buffer.from(`${randomUUID()}-${randomUUID()}`).toString('base64'),
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
