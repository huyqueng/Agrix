import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

//data transfer object
export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @ApiProperty({ example: 'superuser@gmail.com' })
  email: string;

  @ApiProperty({ example: 'abc@123' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}
