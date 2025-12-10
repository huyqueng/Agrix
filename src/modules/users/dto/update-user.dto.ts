import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'superuser@gmail.com',
    description: 'Email mới của người dùng (nếu muốn thay đổi)',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'newPassword123',
    description: 'Mật khẩu mới (ít nhất 6 ký tự)',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'Nguyễn Văn B',
    description: 'Họ tên mới của người dùng',
  })
  fullName?: string;

  @ApiPropertyOptional({
    example: UserRole.USER,
    enum: UserRole,
  })
  role?: UserRole;
}
