import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { CartItem, CartItemSchema } from "./cart-item.schema";

@Schema({ timestamps: true })
export class Cart {  
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  userId: Types.ObjectId;
  @Prop()
  totalPrice: number;
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[]
}

export const CartSchema = SchemaFactory.createForClass(CartItem);
