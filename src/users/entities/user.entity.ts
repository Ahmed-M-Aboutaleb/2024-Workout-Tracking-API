import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Roles } from '../../roles/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String, enum: Roles, default: Roles.USER })
  role: Roles;

  @Prop({ type: Date })
  createdAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
