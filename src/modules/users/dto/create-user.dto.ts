import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@modules/roles/roles.service';

//data transfer object
export class CreateUserDto {
  @ApiProperty({ example: 'superuser@gmail.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống.' })
  @IsString({ message: 'Tên người dùng không hợp lệ.' })
  fullName: string;

  @ApiProperty({ example: UserRole.USER, enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Vai trò phải là Quản trị viên hoặc Người dùng.',
  })
  role?: UserRole;
}
