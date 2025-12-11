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
import { ImageValidationPipe } from 'common/pipes/image-validation.pipe';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Public()
  @Post('create')
  @ResponseMessage('Thêm mới bệnh cây trồng thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createDiseaseDto: CreateDiseaseDto,
    @UploadedFiles(ImageValidationPipe) images: Express.Multer.File[],
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

  @Public()
  @UseInterceptors(FilesInterceptor('images', 5))
  @Patch('edit/:id')
  @ResponseMessage('Cập nhật thông tin bệnh cây trồng thành công')
  update(
    @Param('id') diseaseId: string,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
    @UploadedFiles(ImageValidationPipe) images?: Express.Multer.File[],
  ) {
    return this.diseasesService.update(diseaseId, updateDiseaseDto, images);
  }

  @Delete(':id')
  remove(@Param('id') diseaseId: string) {
    return this.diseasesService.remove(diseaseId);
  }
}
