import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user) {
    // Nếu có lỗi từ strategy hoặc không có user
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Email hoặc mật khẩu không hợp lệ.')
      );
    }
    return user;
  }
}
