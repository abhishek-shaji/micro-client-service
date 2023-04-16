import { Document, model, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import ShortUniqueId from 'short-unique-id';

import { Currency } from '@abhishek-shaji/micro-common/enums';
import { User, Merchant } from '@abhishek-shaji/micro-common/models';
import {
  deletionTrait,
  onDelete,
  onRecover,
} from '@abhishek-shaji/micro-common/traits';

class Order extends Document {}

const schema = new Schema<Order>(
  {},
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

schema.static('archive', onDelete);
schema.static('recover', onRecover);

const OrderModel = model<Order, PaginateModel<Order>>('Order', schema);

export { Order, OrderModel };
