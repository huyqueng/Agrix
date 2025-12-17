import { PartialType } from '@nestjs/mapped-types';
import { CreateDiseaseDto } from './create-disease.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiseaseDto extends PartialType(CreateDiseaseDto) {
  @ApiProperty({
    example: 'Bệnh phấn trắng',
    description: 'Tên bệnh mới nếu muốn cập nhật',
  })
  name?: string;

  @ApiProperty({
    example: 'Phấn trắng, sương mai, thán thư, thối gốc',
    description: 'Triệu chứng mới nếu muốn cập nhật',
  })
  symptoms?: string;

  @ApiProperty({
    example: 'Sử dụng thuốc trừ nấm, vệ sinh đồng ruộng',
    description: 'Phương pháp điều trị mới nếu muốn cập nhật',
  })
  treatment?: string;

  @ApiProperty({
    example: '60f7c0c2b4d1c826d8f0a5b4',
    description: 'ID cây trồng mới nếu muốn cập nhật',
  })
  plantId?: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Danh sách URL hình ảnh minh họa cho bệnh (nếu muốn cập nhật)',
  })
  images?: string[];
}
