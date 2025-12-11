import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateDiseaseDto {
  @IsNotEmpty({ message: 'Tên bệnh không được để trống.' })
  name: string;

  @IsNotEmpty({ message: 'Triệu chứng không được để trống.' })
  symptoms: string;

  @IsNotEmpty({ message: 'Phương pháp điều trị không được để trống.' })
  treatment: string;

  @IsNotEmpty({ message: 'Vui lòng chọn cây trồng' })
  plantId: string;

  @IsOptional()
  images?: string[];
}
