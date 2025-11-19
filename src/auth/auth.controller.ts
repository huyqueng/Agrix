import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/auth.decorator';
import { UserRole } from 'src/users/schemas/user.schema';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Đăng nhập thất bại' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiTags('auth')
  @ApiResponse({ status: 201, description: 'Đăng kí thành công' })
  @ApiResponse({ status: 401, description: 'Đăng kí thất bại' })
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
