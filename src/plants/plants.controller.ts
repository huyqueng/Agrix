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
import { Public } from 'src/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/pipes/image-validation.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  //Thêm mới
  @Public()
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Thêm mới cây trồng thành công')
  create(
    @Body() createPlantDto: CreatePlantDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ) {
    return this.plantsService.create(createPlantDto, image);
  }

  @Public()
  @Get()
  findAll() {
    return this.plantsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') plantId: string) {
    return this.plantsService.findOne(plantId);
  }

  @Public()
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

  @Public()
  @Delete(':id')
  @ResponseMessage('Xóa cây trồng thành công')
  remove(@Param('id') plantId: string) {
    return this.plantsService.remove(plantId);
  }
}
