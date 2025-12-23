import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { Counter } from 'shared/counter.entity';
import { FilesService } from '@modules/files/files.service';
import { paginate } from 'shared/pagination.util';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    private readonly filesService: FilesService,
  ) {}

  async create(createPostDto: CreatePostDto, images: Express.Multer.File[]) {
    const imageUrls = await this.filesService.uploadImages(images);
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'postId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return this.postModel.create({
      postId: counter.seq,
      ...createPostDto,
      images: imageUrls,
    });
  }

  findAll(currentPage: number = 1, limit: number = 10) {
    return paginate(this.postModel, currentPage, limit);
  }

  async findOne(postId: number) {
    const post = await this.postModel.findOne({ postId });
    if (!post) throw new NotFoundException('Bài viết không tồn tại.');
    return post;
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
}
