import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreatePlantDto {
  @IsNotEmpty({ message: 'Tên cây trồng không được để trống.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  imgUrl: string;
}
