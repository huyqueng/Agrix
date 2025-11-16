import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  getHashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    return hashPassword;
  }

  isPasswordValid(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isPasswordValid = this.isPasswordValid(pass, user?.password);
      if (isPasswordValid === true) return user;
      else return null;
    }
  }

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //register
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException(
        'Email đã tồn tại, vui lòng sử dụng email khác.',
      );
    }

    const user = await this.usersService.create(registerDto);
    return user;
  }
}
