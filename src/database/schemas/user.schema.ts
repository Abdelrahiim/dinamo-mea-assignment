import { Schema, Prop,SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phoneNumber: string;
  @Prop({ required: true })
  address: string;

  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ type: [String], enum: ['user', 'admin', 'vendor'], default: ['user'] })
  roles: string[];
}

// Create a Mongoose schema for the User entity
export const UserSchema = SchemaFactory.createForClass(User);
