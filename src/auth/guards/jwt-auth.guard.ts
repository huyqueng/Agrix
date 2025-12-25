import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'auth/auth.decorator';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super();
  }
  //Lấy metadata từ request
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    let accessToken = request.cookies['access_token'];
    let refreshToken = request.cookies['refresh_token'];

    // Nếu không có refresh token → lỗi
    if (!refreshToken) {
      throw new UnauthorizedException('Token không hợp lệ.');
    }

    // Thử verify access token
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
      request.user = payload;
      return true;
    } catch (error) {
      // Access token hết hạn → dùng refresh token cấp mới
      try {
        const payload = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });

        const newAccessToken = this.jwtService.sign(
          {
            _id: payload._id,
            userId: payload.userId,
            email: payload.email,
            fullName: payload.fullName,
            role: payload.role,
          },
          { expiresIn: '15m' },
        );

        // Set cookie access_token mới
        response.cookie('access_token', newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          sameSite: 'none',
          // secure: true,
        });

        request.user = payload;
        return true;
      } catch (refreshError) {
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        throw new UnauthorizedException('Token không hợp lệ.');
      }
    }
  }

  // canActivate(context: ExecutionContext) {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  //   if (isPublic) {
  //     return true;
  //   }

  //   return super.canActivate(context);
  // }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ.');
    }
    return user;
  }
}
