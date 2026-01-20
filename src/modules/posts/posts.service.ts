import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { Counter } from 'shared/counter.entity';
import { FilesService } from '@modules/files/files.service';
import { paginate } from 'shared/pagination.util';
import { IUSer } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { PostLike } from './entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PostLike.name) private postLikeModel: Model<PostLike>,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: IUSer,
    images: Express.Multer.File[],
  ) {
    const imageUrls = await this.filesService.uploadImages(images);
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'postId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return this.postModel.create({
      postId: counter.seq,
      userId: user.userId,
      ...createPostDto,
      images: imageUrls,
    });
  }

  async findAll(currentPage: number = 1, limit: number = 10, user?: IUSer) {
    const result = await paginate(this.postModel, currentPage, limit, {}, '', {
      createdAt: -1,
    });

    if (!user) {
      return result;
    }

    // Add isLiked for each post
    const posts = result.items.map(async (post) => {
      const like = await this.postLikeModel.findOne({
        postId: post.postId,
        userId: user.userId,
      });
      return {
        ...post.toObject(),
        isLiked: !!like,
      };
    });

    return {
      ...result,
      items: await Promise.all(posts),
    };
  }

  async findOne(postId: number, user?: IUSer) {
    const post = await this.postModel.findOne({ postId });
    if (!post) throw new NotFoundException('Bài viết không tồn tại.');

    const uploadBy = await this.userModel
      .findOne({ userId: post.userId })
      .select('userId fullName avatar');

    let isLiked = false;
    if (user) {
      const like = await this.postLikeModel.findOne({
        postId: post.postId,
        userId: user.userId,
      });
      isLiked = !!like;
    }

    return { ...post.toObject(), uploadBy, isLiked };
  }

  async update(
    postId: number,
    updatePostDto: UpdatePostDto,
    images: Express.Multer.File[],
  ) {
    await this.findOne(postId);

    const imageUrls = await this.filesService.uploadImages(images);

    return this.postModel.findOneAndUpdate(
      { postId },
      {
        ...updatePostDto,
        images: imageUrls,
      },
      { new: true },
    );
  }

  async remove(postId: number) {
    await this.findOne(postId);
    return this.postModel.findOneAndDelete({ postId });
  }

  async likePost(postId: number, user: IUSer) {
    const userId = user.userId;
    const existingLike = await this.postLikeModel.findOne({ postId, userId });

    if (existingLike) {
      await this.postLikeModel.deleteOne({ postId, userId });
      await this.postModel.updateOne({ postId }, { $inc: { likesCount: -1 } });
      return { liked: false };
    } else {
      await this.postLikeModel.create({ postId, userId });
      await this.postModel.updateOne({ postId }, { $inc: { likesCount: 1 } });
      return { liked: true };
    }
  }

  async getLikedUsers(
    postId: number,
    currentPage: number = 1,
    limit: number = 20,
  ) {
    const likes = await this.postLikeModel.find({ postId }).select('userId');
    const userIds = likes.map((like) => like.userId);

    return paginate(
      this.userModel,
      currentPage,
      limit,
      { userId: { $in: userIds } },
      'userId fullName avatar',
    );
  }

  async getMyPosts(currentPage: number = 1, limit: number = 10, user: IUSer) {
    const result = await paginate(this.postModel, currentPage, limit, {
      userId: user.userId,
    });

    // Add isLiked for each post
    const posts = result.items.map(async (post) => {
      const like = await this.postLikeModel.findOne({
        postId: post.postId,
        userId: user.userId,
      });
      return {
        ...post.toObject(),
        isLiked: !!like,
      };
    });

    return {
      ...result,
      items: await Promise.all(posts),
    };
  }
}
