import { ApiProperty } from '@nestjs/swagger';

export class CreateDiagnosisDto {
  @ApiProperty({ example: 'image.jpg' })
  imageUrl: string;
}
