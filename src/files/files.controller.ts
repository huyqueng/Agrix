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
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/auth.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('upload')
  @ResponseMessage('Tải ảnh lên thành công')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png|webp)$/i,
        }) //RegExp (bieu thuc chinh quy) - i: kieu chinh quy khong phan biet chu hoa va thuong
        .addMaxSizeValidator({
          maxSize: 10 * 1024, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: (error) => {
            let message = 'File không hợp lệ';

            if (typeof error === 'string') {
              if (error.includes('expected type')) {
                message =
                  'Chỉ chấp nhận file có định dạng: jpg, jpeg, png, webp';
              } else if (error.includes('expected size')) {
                message = 'Kích thước file không được vượt quá 10MB';
              }
            }

            return new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(file);
  }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
