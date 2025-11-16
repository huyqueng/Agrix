import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
    return this.userModel.updateOne({ _id: userId }, { ...updateUserDto });
  }

  remove(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }
}
