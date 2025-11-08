import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from "bcryptjs";
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){ }

  getHashPassword (password: string) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      return hashPassword;
  }
  
  // create(createUserDto: CreateUserDto) {
  async create(email, password, fullName) {
    //Create user
    const hashPassword = this.getHashPassword(password)
    let user =  await this.userModel.create({email, password: hashPassword, fullName})
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
