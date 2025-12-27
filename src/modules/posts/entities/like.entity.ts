import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class PostLike {
  @Prop({ required: true })
  postId: number;

  @Prop({ required: true })
  userId: number;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
