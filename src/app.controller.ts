import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoginDto } from './auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JWTAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
