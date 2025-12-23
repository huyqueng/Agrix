import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @ApiProperty({ example: 'Tiêu đề bài viết' })
  title?: string;

  @IsOptional()
  @ApiProperty({ example: 'Mô tả chi tiết về vấn đề cây trồng...' })
  content?: string;

  @IsOptional()
  @ApiProperty({ example: 'Mô tả chi tiết về vấn đề cây trồng...' })
  images?: string[];
}
