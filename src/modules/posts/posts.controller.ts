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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { ResponseMessage } from 'common/decorators/response-message.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @ResponseMessage('Thêm mới bài viết thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.postsService.create(createPostDto, images);
  }

  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @Get()
  @ResponseMessage('Lấy danh sách bài viết thành công')
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.postsService.findAll(currentPage, limit);
  }

  @Get(':postId')
  @ResponseMessage('Lấy thông tin bài viết thành công')
  findOne(@Param('postId') postId: number) {
    return this.postsService.findOne(postId);
  }

  @UseInterceptors(FilesInterceptor('images', 5))
  @Patch('edit/:postId')
  @ResponseMessage('Cập nhật bài viết thành công')
  update(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.postsService.update(postId, updatePostDto, images);
  }

  @Delete(':postId')
  @ResponseMessage('Xoa bài viết thành công')
  remove(@Param('postId') postId: number) {
    return this.postsService.remove(postId);
  }
}
