import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop({ required: true, type: Types.ObjectId, ref: "Product" })
  readonly productId: string;

  @Prop({ required: true })
  readonly quantity: number;

  @Prop({ required: true })
  readonly price: number;

  @Prop({ required: true })
  readonly totalPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
