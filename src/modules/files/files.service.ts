import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from 'config/cloudinary.config';
import streamifier from 'streamifier';

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

  uploadImages(files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }
}
