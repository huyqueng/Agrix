import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Nội dung bình luận' })
  content: string;

  @ApiProperty({ example: '1', description: 'Bình luận cha' })
  parentId?: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  images?: string[];
}
