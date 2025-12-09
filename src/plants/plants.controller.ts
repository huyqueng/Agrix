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
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Public } from 'src/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/pipes/image-validation.pipe';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  //Thêm mới
  @Public()
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
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
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
    return this.plantsService.update(+id, updatePlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
