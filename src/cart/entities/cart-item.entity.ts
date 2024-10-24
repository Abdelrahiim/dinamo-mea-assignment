import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Product } from "src/product/schema/product.model";

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, unique: true })
  productId: Types.ObjectId;
  @Prop({ required: true })
  quantity: number;
  
  @Prop({ required: true })
  totalPrice: number;
}

// Create a type for populated CartItem
export const CartItemSchema = SchemaFactory.createForClass(CartItem);