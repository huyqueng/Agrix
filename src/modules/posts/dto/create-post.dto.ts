import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống.' })
  @ApiProperty({ example: 'Tiêu đề bài viết' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống.' })
  @ApiProperty({ example: 'Mô tả chi tiết về vấn đề cây trồng...' })
  content: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Danh sách URL hình ảnh bài viết',
  })
  images?: string[];
}
