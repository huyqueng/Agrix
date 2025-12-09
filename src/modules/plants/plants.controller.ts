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
  Res,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { ImageValidationPipe } from 'common/pipes/image-validation.pipe';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  //Thêm mới

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Thêm mới cây trồng thành công')
  create(
    @Body() createPlantDto: CreatePlantDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ) {
    return this.plantsService.create(createPlantDto, image);
  }

  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') plantId: string) {
    return this.plantsService.findOne(plantId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Cập nhật thông tin cây trồng thành công')
  update(
    @Param('id') id: string,
    @Body() updatePlantDto: UpdatePlantDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return this.plantsService.update(id, updatePlantDto, image);
  }

  @Delete(':id')
  @ResponseMessage('Xóa cây trồng thành công')
  remove(@Param('id') plantId: string) {
    return this.plantsService.remove(plantId);
  }
}
