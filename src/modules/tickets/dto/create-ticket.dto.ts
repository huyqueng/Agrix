import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @ApiProperty({ example: 'Tiêu đề ticket' })
  title: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @ApiProperty({ example: 'Mô tả chi tiết về vấn đề...' })
  description: string;
}
