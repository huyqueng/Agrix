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
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'auth/auth.decorator';
import type { IUSer } from '@modules/users/users.service';

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post('create/cucumber')
  @ResponseMessage('Chuẩn đoán bệnh thành công')
  @UseInterceptors(FileInterceptor('image'))
  create(@User() user: IUSer, @UploadedFile() image: Express.Multer.File) {
    return this.diagnosisService.create(user, image);
  }

  @Get()
  findAll() {
    return this.diagnosisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
  ) {
    return this.diagnosisService.update(+id, updateDiagnosisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosisService.remove(+id);
  }
}
