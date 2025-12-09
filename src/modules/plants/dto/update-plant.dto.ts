import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePlantDto } from './create-plant.dto';

export class UpdatePlantDto extends PartialType(CreatePlantDto) {
  @ApiPropertyOptional({ example: 'Dưa chuột' })
  name?: string;

  @ApiPropertyOptional({ example: 'Phấn trắng, sương mai, thán thư, thối gốc' })
  description?: string;

  @ApiPropertyOptional({
    example: 'image1.jpg',
    description:
      'Gửi kèm file ảnh khi tạo cây trồng, data trả ra sẽ là đường dẫn ảnh',
  })
  image?: string;
}
