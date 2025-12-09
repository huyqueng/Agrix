import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthService } from 'auth/auth.service';

export interface IUSer {
  _id: string;
  email: string;
  password: string;
  role: string;
  fullName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new UnauthorizedException(
        'Email đã tồn tại, vui lòng sử dụng email khác.',
      );
    }

    const hashPassword = this.authService.getHashPassword(
      createUserDto.password,
    );

    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      fullName: createUserDto.fullName,
      role: createUserDto.role,
    });

    const { password, ...result } = user.toObject();
    return result;
  }

  findAll() {
    return this.userModel.find().select('-password');
  }

  findOne(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .updateOne({ _id: userId }, { ...updateUserDto })
      .select('-password');
  }

  remove(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }
}
