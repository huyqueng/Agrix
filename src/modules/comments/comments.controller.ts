import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { User } from 'auth/auth.decorator';
import type { IUSer } from '@modules/users/users.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create/:postId')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ResponseMessage('Bình luận bài viết thành công')
  create(
    @User() user: IUSer,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.commentsService.create(user, postId, createCommentDto, images);
  }

  @Get('get-list')
  @ResponseMessage('Lấy danh sách bình luận thành công')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 20, required: false })
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.commentsService.findAll(currentPage, limit);
  }

  @Get('by-post/:postId')
  @ResponseMessage('Lấy danh sách bình luận thành công')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 20, required: false })
  getCommentsByPost(
    @Param('postId') postId: number,
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.commentsService.getCommentsByPost(postId, currentPage, limit);
  }

  @Get('get-comment/:commentId')
  @ResponseMessage('Lấy nội dung bình luận thành công')
  findOne(@Param('commentId') commentId: number) {
    return this.commentsService.findOne(commentId);
  }

  @Delete('delete/:commentId')
  @ResponseMessage('Xoá bình luận thành công')
  remove(@Param('commentId') commentId: number) {
    return this.commentsService.remove(commentId);
  }

  @Post('reply/:parentId')
  @ResponseMessage('Trả lời bình luận thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  reply(
    @User() user: IUSer,
    @Param('parentId') parentId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.commentsService.reply(user, parentId, createCommentDto, images);
  }

  @Get('get-replies/:parentId')
  @ResponseMessage('Lấy danh sách bình luận trả lời thành công')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 5, required: false })
  getReplies(
    @Param('parentId') parentId: number,
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.commentsService.getReplies(parentId, currentPage, limit);
  }
}
