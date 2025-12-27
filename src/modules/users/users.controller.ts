import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { IUSer } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles, User } from 'auth/auth.decorator';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { UserRole } from '@modules/roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post('create')
  @ResponseMessage('Thêm mới người dùng thành công')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @Get()
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.usersService.findAll(currentPage, limit);
  }

  @Roles(UserRole.ADMIN)
  @ResponseMessage('Lấy thống tin người dùng thành công')
  @Get(':userId')
  findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Patch('edit/:id')
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  update(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  remove(@Param('id') userId: number) {
    return this.usersService.remove(userId);
  }

  @Get('/profile/me')
  @ResponseMessage('Lấy thông tin cá nhân thành công')
  async getMe(@User() user: IUSer) {
    return {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
    };
  }

  @Patch('me/edit')
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  async updateMe(
    @User() user: IUSer,
    @Body()
    updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updatedUser = await this.usersService.updateMe(
      user.userId,
      updateUserDto,
    );

    const newPayload = {
      _id: updatedUser._id,
      userId: updatedUser.userId,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    return {
      _id: updatedUser._id,
      userId: updatedUser.userId,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    };
  }
}
