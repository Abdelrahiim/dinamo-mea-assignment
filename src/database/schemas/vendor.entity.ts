import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Product } from "src/product/schema/product.model";

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ required: true , unique: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  totalRate: string;

  @Prop([{ type: Types.ObjectId, ref: 'Product', default: [] }])
  products: Types.ObjectId[];
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
