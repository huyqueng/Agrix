import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

//data transfer object
export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  password: string;
}
