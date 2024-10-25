import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;
  @Prop({ required: true, type: [OrderItemSchema] })
  orderItems: OrderItem[];
  @Prop()
  totalItemsPrice: number;
  @Prop()
  shippingAddress: string;
  @Prop()
  shippingPrice: number;
  @Prop()
  @Prop()
  totalPrice: number;

  @Prop({
    enum: ['pending', 'inProgress', 'delivered', 'canceled'],
    default: 'pending',
  })
  status: string;
  @Prop()
  deliveredAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
