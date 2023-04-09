import { AggregatePaginateModel, Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-aggregate-paginate-v2';

class Order extends Document {}

const schema = new Schema<Order>({});

schema.plugin(mongoosePaginate);

const OrderModel = model<Order, AggregatePaginateModel<Order>>('Order', schema);

export { Order, OrderModel };
