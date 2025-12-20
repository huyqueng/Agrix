import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateDiseaseDto {
  @IsNotEmpty({ message: 'Tên bệnh không được để trống.' })
  @ApiProperty({ example: 'Bệnh phấn trắng' })
  name: string;

  @IsNotEmpty({ message: 'Triệu chứng không được để trống.' })
  @ApiProperty({ example: 'Phấn trắng, sương mai, thán thư, thối gốc' })
  symptoms: string;

  @IsNotEmpty({ message: 'Phương pháp điều trị không được để trống.' })
  @ApiProperty({ example: 'Sử dụng thuốc trừ nấm, vệ sinh đồng ruộng' })
  treatment: string;

  @IsNotEmpty({ message: 'Vui lòng chọn cây trồng' })
  @ApiProperty({ example: '1' })
  plantId: number;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Danh sách URL hình ảnh minh họa cho bệnh',
  })
  images: string[];
}
