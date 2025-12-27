import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './entities/comment.entity';
import { Model } from 'mongoose';
import { FilesService } from '@modules/files/files.service';
import { Counter } from 'shared/counter.entity';
import { IUSer } from '@modules/users/users.service';
import { Post } from '@modules/posts/entities/post.entity';
import { paginate } from 'shared/pagination.util';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private filesService: FilesService,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}
  async create(
    user: IUSer,
    postId: number,
    createCommentDto: CreateCommentDto,
    images: Express.Multer.File[],
  ) {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'commentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const imageUrls =
      images.length > 0 ? await this.filesService.uploadImages(images) : [];

    const comment = await this.commentModel.create({
      userId: user.userId,
      postId,
      commentId: counter.seq,
      ...createCommentDto,
      images: imageUrls,
    });

    await this.postModel.updateOne({ postId }, { $inc: { commentsCount: 1 } });

    return comment;
  }

  findAll(currentPage: number = 1, limit: number = 20) {
    return paginate(this.commentModel, currentPage, limit);
  }

  async getCommentsByPost(
    postId: number,
    currentPage: number = 1,
    limit: number = 20,
  ) {
    const post = await this.postModel.findOne({ postId });
    if (!post) throw new NotFoundException('Bài viết không tồn tại.');

    return paginate(this.commentModel, currentPage, limit, { postId });
  }

  async findOne(commentId: number) {
    const comment = await this.commentModel.findOne({ commentId });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại.');

    return comment;
  }

  async remove(commentId: number) {
    const comment = await this.findOne(commentId);

    const deleted = await this.commentModel.findOneAndDelete({ commentId });

    await this.postModel.updateOne(
      { postId: comment.postId },
      { $inc: { commentsCount: -1 } },
    );

    return deleted;
  }

  async reply(
    user: IUSer,
    parentId: number,
    createCommentDto: CreateCommentDto,
    images: Express.Multer.File[],
  ) {
    const parent = await this.commentModel.findOne({ commentId: parentId });
    if (!parent) throw new NotFoundException('Bình luận cha không tồn tại.');

    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'commentId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const imageUrls =
      images.length > 0 ? await this.filesService.uploadImages(images) : [];

    const comment = await this.commentModel.create({
      userId: user.userId,
      postId: parent.postId,
      parentId,
      commentId: counter.seq,
      ...createCommentDto,
      images: imageUrls,
    });

    await this.postModel.updateOne(
      { postId: parent.postId },
      { $inc: { commentsCount: 1 } },
    );

    return comment;
  }

  async getReplies(
    parentId: number,
    currentPage: number = 1,
    limit: number = 5,
  ) {
    console.log('🚀 ~ CommentsService ~ getReplies ~ parentId:', parentId);
    await this.findOne(parentId);

    return paginate(this.commentModel, currentPage, limit, { parentId });
  }
}
