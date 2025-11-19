import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateDiseaseDto {
  // @IsNotEmpty({ message: 'Tên bệnh không được để trống.' })
  // @IsString()
  name: string;

  // @IsNotEmpty({ message: 'Triệu chứng không được để trống.' })
  // @IsString()
  symptoms: string;

  // @IsNotEmpty({ message: 'Phương pháp điều trị không được để trống.' })
  // @IsString()
  treatment: string;

  // @IsNotEmpty({ message: 'Vui lòng chọn cây trồng' })
  // @IsMongoId({ message: 'plant_id không hợp lệ' })
  plant_id?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  image_urls?: string[];
}
