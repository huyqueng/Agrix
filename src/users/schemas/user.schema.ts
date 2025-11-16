import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ trim: true, default: '' })
  avatarUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
