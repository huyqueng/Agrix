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
import { Public, Roles } from 'auth/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { ImageValidationPipe } from 'common/pipes/image-validation.pipe';
import { UserRole } from '@modules/roles/roles.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Roles(UserRole.ADMIN)
  @Post('create')
  @ResponseMessage('Thêm mới bệnh cây trồng thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createDiseaseDto: CreateDiseaseDto,
    @UploadedFiles(ImageValidationPipe) images: Express.Multer.File[],
  ) {
    return this.diseasesService.create(createDiseaseDto, images);
  }

  @Get()
  @ResponseMessage('Lấy danh sách bệnh cây trồng thành công')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.diseasesService.findAll(currentPage, limit);
  }

  @Get('by-plant')
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  @ResponseMessage('Lấy danh sách bệnh theo cây trồng thành công')
  getDiseasesByPlant(
    @Query('page') currentPage: number,
    @Query('limit') limit: number,
    @Query('plantId') plantId: number,
  ) {
    return this.diseasesService.getDiseasesByPlant(currentPage, limit, plantId);
  }

  @Get(':diseaseId')
  @ResponseMessage('Lấy thông tin bệnh cây trồng thành công')
  findOne(@Param('diseaseId') diseaseId: number) {
    return this.diseasesService.findOne(diseaseId);
  }

  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 5))
  @Patch('edit/:diseaseId')
  @ResponseMessage('Cập nhật thông tin bệnh cây trồng thành công')
  update(
    @Param('diseaseId') diseaseId: number,
    @Body() updateDiseaseDto: UpdateDiseaseDto,
    @UploadedFiles(ImageValidationPipe) images?: Express.Multer.File[],
  ) {
    return this.diseasesService.update(diseaseId, updateDiseaseDto, images);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':diseaseId')
  remove(@Param('diseaseId') diseaseId: number) {
    return this.diseasesService.remove(diseaseId);
  }
}
