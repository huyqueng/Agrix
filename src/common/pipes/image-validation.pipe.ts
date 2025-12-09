import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = /(jpeg|jpg|png|webp)$/i;

  transform(image: Express.Multer.File): Express.Multer.File | undefined {
    if (!image) {
      return undefined;
    }

    //Check type
    const mimetype = image.mimetype.split('/')[1];
    if (!this.ALLOWED_TYPES.test(mimetype)) {
      //return a boolean
      throw new BadRequestException(
        'Chỉ chấp nhận file có định dạng: .jpg, .jpeg, .png, .webp',
      );
    }

    //Check size
    if (image.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('Kích thước file không được vượt quá 10MB');
    }

    return image;
  }
}
