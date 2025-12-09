import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/users/schemas/user.schema';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  @ApiProperty({ example: 'superuser@gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @ApiProperty({ example: '123456', minLength: 6 })
  password: string;

  @IsNotEmpty({ message: 'Tên người dùng không được để trống.' })
  @IsString()
  @ApiProperty({ example: 'SuperUser', uniqueItems: true })
  fullName: string;
}
