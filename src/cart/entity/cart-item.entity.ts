import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
  
  @Prop({ required: true })
  quantity: number;
  
  @Prop({ required: true })
  totalPrice: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
