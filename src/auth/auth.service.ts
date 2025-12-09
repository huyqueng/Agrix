import { forwardRef, Inject, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { IUSer, UsersService } from '@modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async login(user: IUSer) {
    const { _id, email, role, fullName } = user;
    const payload = {
      sub: 'Token login',
      iss: 'from server',
      _id,
      email,
      fullName,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        id: payload._id,
        email,
        fullName,
        role,
      },
    };
  }

  //register
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return user;
  }

  createRefreshToken(payload: any) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '30d',
    });
    return refresh_token;
  }
}
