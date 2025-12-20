import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { ImageValidationPipe } from 'common/pipes/image-validation.pipe';
import { Public } from 'auth/auth.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('upload')
  @ResponseMessage('Tải ảnh lên thành công')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(ImageValidationPipe)
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(file);
  }

  @Public()
  @Post('uploads')
  @ResponseMessage('Tải ảnh lên thành công')
  @UseInterceptors(FileInterceptor('files'))
  uploadFiles(
    @UploadedFile(ImageValidationPipe)
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadImages(files);
  }
}
