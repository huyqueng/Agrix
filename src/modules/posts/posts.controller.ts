import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import type { IUSer } from '@modules/users/users.service';
import { User } from 'auth/auth.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @ResponseMessage('Thêm mới bài viết thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
    @User() user: IUSer,
  ) {
    return this.postsService.create(createPostDto, user, images);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ResponseMessage('Lấy danh sách bài viết thành công')
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.postsService.findAll(currentPage, limit);
  }

  @Get('get-detail/:postId')
  @ResponseMessage('Lấy thông tin bài viết thành công')
  findOne(@Param('postId') postId: number) {
    return this.postsService.findOne(postId);
  }

  @Patch('edit/:postId')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ResponseMessage('Cập nhật bài viết thành công')
  update(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.postsService.update(postId, updatePostDto, images);
  }

  @Delete(':postId')
  @ResponseMessage('Xoá bài viết thành công')
  remove(@Param('postId') postId: number) {
    return this.postsService.remove(postId);
  }

  @Patch(':postId/like')
  @ResponseMessage('Thích bài viết thành công')
  likePost(@Param('postId') postId: number, @User() user: IUSer) {
    return this.postsService.likePost(postId, user);
  }

  @Get(':postId/liked-users')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ResponseMessage('Lấy danh sách người dùng thích bài viết thành công')
  getLikedUsers(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.postsService.getLikedUsers(postId, currentPage, limit);
  }

  @Get('my-posts')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ResponseMessage('Lấy danh sách bài viết của người dùng thành công')
  getMyPosts(
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
    @User() user: IUSer,
  ) {
    return this.postsService.getMyPosts(currentPage, limit, user);
  }
}
