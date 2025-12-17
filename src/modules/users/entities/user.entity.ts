import { UserRole } from '@modules/roles/roles.service';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// import mongooseDelete, { type SoftDeleteModel } from 'mongoose-delete';

export type UserDocument = HydratedDocument<User>;

// export type UserModel = SoftDeleteModel<UserDocument>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  id: string;
    
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
}

export const UserSchema = SchemaFactory.createForClass(User);
//soft delete
// UserSchema.plugin(mongooseDelete, {
//   deletedAt: true,
//   deletedBy: true,
//   overrideMethods: true,
//   index: true,
// });

// export { UserSchema };
