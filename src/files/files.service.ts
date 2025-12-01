import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FilesService {
  async uploadImage(file: Express.Multer.File) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'plants',
      resource_type: 'image',
    });

    return result.url;
  }

  // findAll() {
  //   return `This action returns all files`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} file`;
  // }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}
