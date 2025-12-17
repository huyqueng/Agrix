import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles } from 'auth/auth.decorator';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { UserRole } from '@modules/roles/roles.service';

// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post('create')
  @ResponseMessage('Thêm mới người dùng thành công')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @ResponseMessage('Lấy thống tin người dùng thành công')
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('edit/:id')
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  update(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  remove(@Param('id') userId: string) {
    return this.usersService.remove(userId);
  }
}
