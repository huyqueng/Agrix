import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/auth/auth.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ResponseMessage('Đăng nhập thành công')
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

    return user;
  }

  // @ApiResponse({ status: 201, description: 'Đăng kí thành công' })
  // @ApiResponse({ status: 401, description: 'Đăng kí thất bại' })
  @Public()
  @Post('register')
  @ResponseMessage('Đăng kí thành công')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('logout')
  @ResponseMessage('Đăng xuất thành công')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return;
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    // if (!refreshToken) throw new UnauthorizedException('No refresh token');

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const newAccessToken = this.jwtService.sign(
        { _id: payload._id, fullName: payload.fullName, role: payload.role },
        { expiresIn: '15m' }, // access token ngắn
      );

      return { access_token: newAccessToken };
    } catch (error) {
      res.clearCookie('refresh_token');
      // throw new UnauthorizedException('Refresh token invalid');
    }
  }
}
