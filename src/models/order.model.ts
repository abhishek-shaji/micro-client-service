import { AggregatePaginateModel, Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-aggregate-paginate-v2';

import { Customer } from './customer.model';

class Order extends Document {
  token: string;
  customer: Customer;
  expiresAt: Date;
}

const schema = new Schema<Order>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

schema.plugin(mongoosePaginate);

const OrderModel = model<Order, AggregatePaginateModel<Order>>('Order', schema);

export { Order, OrderModel };
