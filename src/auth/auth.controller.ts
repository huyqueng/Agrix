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
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Public } from './auth.decorator';
import { ResponseMessage } from 'common/decorators/response-message.decorator';

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

    // // set access token cookie (httpOnly) and refresh token cookie
    res.cookie('access_token', user.access_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15m
      sameSite: 'lax',
      secure: true,
    });

    res.cookie('refresh_token', user.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
      sameSite: 'lax',
      secure: true,
    });

    return user;
  }

  //Dang ky
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
    res.clearCookie('access_token');
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

      // set new access token cookie
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        maxAge: 5 * 1000, // 15m
        sameSite: 'lax',
        secure: true,
      });

      return { access_token: newAccessToken };
    } catch (error) {
      res.clearCookie('refresh_token');
    }
  }
}
