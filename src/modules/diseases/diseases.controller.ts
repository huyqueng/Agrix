import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { Public } from 'auth/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { response } from 'express';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Public()
  @Post('create')
  @ResponseMessage('Thêm mới bệnh cây trồng thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createDiseaseDto: CreateDiseaseDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.diseasesService.create(createDiseaseDto, images);
  }

  @Public()
  @ResponseMessage('Lấy danh sách bệnh cây trồng thành công')
  @Get()
  findAll(@Query('plantId') plantId: string) {
    return this.diseasesService.findAll(plantId);
  }

  @Public()
  @ResponseMessage('Lấy thông tin bệnh cây trồng thành công')
  @Get(':diseaseId')
  findOne(@Param('diseaseId') diseaseId: string) {
    return this.diseasesService.findOne(diseaseId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiseaseDto: UpdateDiseaseDto) {
    return this.diseasesService.update(+id, updateDiseaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diseasesService.remove(+id);
  }
}
