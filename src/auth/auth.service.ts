import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
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
}
