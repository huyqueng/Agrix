import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
  @Prop()
  commentId: number;

  @Prop()
  userId: number;

  @Prop()
  postId: number;

  @Prop()
  parentId?: number;

  @Prop()
  content: string;

  @Prop({ default: [] })
  images?: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
