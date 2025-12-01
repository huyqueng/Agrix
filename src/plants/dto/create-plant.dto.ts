import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreatePlantDto {
  @IsNotEmpty({ message: 'Tên bệnh không được để trống.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // @IsNotEmpty({ message: 'Ảnh của cây không được để trống.' })
  // @IsOptional()
  // @IsUrl({}, { each: true })
  // imageUrl: string;
}
