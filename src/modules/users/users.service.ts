import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { AuthService } from 'auth/auth.service';
import { Counter } from 'shared/counter.entity';

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
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //Check duplicate email
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(
        'Email đã tồn tại, vui lòng sử dụng email khác.',
      );
    }

    //Hash password
    const hashPassword = this.authService.getHashPassword(
      createUserDto.password,
    );

    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    let user = await this.userModel.create({
      userId: counter.seq,
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

  async findOne(userId: number) {
    const user = await this.userModel.findOne({ userId }).select('-password');
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    return user;
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    //Check duplicate email
    if (updateUserDto.email) {
      const existingEmail = await this.userModel.findOne({
        email: updateUserDto.email,
        userId: { $ne: userId },
      });

      if (existingEmail) {
        throw new ConflictException(
          'Email đã tồn tại, vui lòng sử dụng email khác.',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.getHashPassword(
        updateUserDto.password,
      );
    }

    //Update user
    const updatedUser = await this.userModel.updateOne(
      { userId },
      {
        ...updateUserDto,
        password: updateUserDto.password,
      },
    );

    return updatedUser;
  }

  remove(userId: number) {
    return this.userModel.deleteOne({ userId });
  }
}
