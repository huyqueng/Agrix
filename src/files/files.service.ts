import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from 'src/config/cloudinary.config';
import streamifier from 'streamifier';
// import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(@Inject(CLOUDINARY) private cloudinary) {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'plants',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.url);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
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
