import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // @ApiBearerAuth()
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(req.user);

    res.cookie('refresh_token', user.refresh_token, {
      httpOnly: true,
      maxAge: 26 * 60 * 60 * 1000, //1d
    });

    return {
      message: 'Đăng nhập thành công',
      data: user,
    };
  }

  // @ApiResponse({ status: 201, description: 'Đăng kí thành công' })
  // @ApiResponse({ status: 401, description: 'Đăng kí thất bại' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
