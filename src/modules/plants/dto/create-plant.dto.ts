import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreatePlantDto {
  @ApiProperty({ example: 'Dưa chuột' })
  @IsNotEmpty({ message: 'Tên cây trồng không được để trống.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Phấn trắng, sương mai, thán thư, thối gốc' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'image1.jpg',
    description:
      'Gửi kèm file ảnh khi tạo cây trồng, data trả ra sẽ là đường dẫn ảnh',
  })
  image: string;
}
