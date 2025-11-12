import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


//data transfer object
export class CreateUserDto {
  @IsEmail({},{ message: "Email không đúng định dạng." })
  @IsNotEmpty({ message: "Email không được để trống." })
  email: string;

  @IsNotEmpty({ message: "Mật khẩu không được để trống." })
  password: string;

  @IsNotEmpty({ message: "Tên người dùng không được để trống." })
  @IsString({ message: "Tên người dùng không hợp lệ." })
  fullName: string; 
}
