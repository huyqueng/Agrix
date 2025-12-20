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
  Query,
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

  @Post('create')
  @ResponseMessage('Thêm mới cây trồng thành công')
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantsService.create(createPlantDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách cây trồng')
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number) {
    return this.plantsService.findAll(currentPage, limit);
  }

  @Get(':plantId')
  findOne(@Param('plantId') plantId: string) {
    return this.plantsService.findOne(plantId);
  }

  @Patch('edit/:plantId')
  @ResponseMessage('Cập nhật thông tin cây trồng thành công')
  update(
    @Param('plantId') plantId: number,
    @Body() updatePlantDto: UpdatePlantDto,
  ) {
    return this.plantsService.update(plantId, updatePlantDto);
  }

  @Delete(':plantId')
  @ResponseMessage('Xóa cây trồng thành công')
  remove(@Param('plantId') plantId: string) {
    return this.plantsService.remove(plantId);
  }
}
