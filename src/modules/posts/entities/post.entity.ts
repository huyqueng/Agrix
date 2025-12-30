import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ unique: true })
  postId: number;

  @Prop()
  userId: number;

  @Prop({ trim: true })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
