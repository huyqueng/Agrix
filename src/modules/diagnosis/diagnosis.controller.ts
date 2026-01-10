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
  Query,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'auth/auth.decorator';
import type { IUSer } from '@modules/users/users.service';
import { ImageValidationPipe } from 'common/pipes/image-validation.pipe';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post('create/cucumber')
  @ResponseMessage('Chuẩn đoán bệnh thành công')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @User() user: IUSer,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ) {
    return this.diagnosisService.create(user, image);
  }

  @Get('get-diagnosis')
  @ResponseMessage('Lấy danh sách lịch sử chuẩn đoán thành công')
  findAll(
    @User() user: IUSer,
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.diagnosisService.findAll(user, currentPage, limit);
  }

  @Get('get-detail/:diagnosisId')
  @ResponseMessage('Lấy thông tin chi tiết chuẩn đoán thành công')
  findOne(@Param('diagnosisId') diagnosisId: number) {
    return this.diagnosisService.findOne(diagnosisId);
  }

  @Delete('/delete/:diagnosisId')
  remove(@Param('diagnosisId') diagnosisId: number) {
    return this.diagnosisService.remove(diagnosisId);
  }

  @Get('get-list')
  @ResponseMessage('Lấy danh sách chuẩn đoán thành công')
  getList(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.diagnosisService.getList(currentPage, limit);
  }
}
