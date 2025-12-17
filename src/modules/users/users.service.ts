import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
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
    // //Check duplicate ID
    // const existingId = await this.userModel.findOne({ id: createUserDto.id });
    // if (existingId) {
    //   throw new UnauthorizedException(
    //     'ID đã tồn tại, vui lòng sử dụng ID khác.',
    //   );
    // }

    //Check duplicate email
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new UnauthorizedException(
        'Email đã tồn tại, vui lòng sử dụng email khác.',
      );
    }

    //Hash password
    const hashPassword = this.authService.getHashPassword(
      createUserDto.password,
    );

    let user = await this.userModel.create({
      // id: createUserDto.id,
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

  async update(userId: string, updateUserDto: UpdateUserDto) {
    // const existingId = await this.userModel.findOne({ id: updateUserDto.id });
    // if (existingId) {
    //   throw new UnauthorizedException(
    //     'ID đã tồn tại, vui lòng sử dụng ID khác.',
    //   );
    // }

    const existingEmail = await this.userModel.findOne({
      email: updateUserDto.email,
    });

    if (existingEmail && existingEmail._id.toString() !== userId) {
      throw new UnauthorizedException(
        'Email đã tồn tại, vui lòng sử dụng email khác.',
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.authService.getHashPassword(
        updateUserDto.password,
      );
    }

    return this.userModel.updateOne(
      { _id: userId },
      { ...updateUserDto, password: updateUserDto.password },
    );
  }

  remove(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }
}
