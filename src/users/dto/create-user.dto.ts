import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';

//data transfer object
export class CreateUserDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Tên người dùng không được để trống.' })
  @IsString({ message: 'Tên người dùng không hợp lệ.' })
  fullName: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Vai trò phải là Quản trị viên hoặc Người dùng.',
  })
  role?: UserRole;
}
