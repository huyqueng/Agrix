import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './entities/plant.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    private readonly filesService: FilesService,
  ) {}

  async create(createPlantDto: CreatePlantDto, image: Express.Multer.File) {
    const existingPlant = await this.plantModel.findOne({
      name: { $regex: '^' + createPlantDto.name.trim() + '$', $options: 'i' },
    });

    if (existingPlant) {
      throw new ConflictException('Cây trồng đã tồn tại.');
    }

    if (!image) {
      throw new BadRequestException('Vui lòng gửi ảnh của cây.');
    }

    try {
      const imgUrl = await this.filesService.uploadImage(image);
      return this.plantModel.create({ ...createPlantDto, image: imgUrl });
    } catch (error) {
      throw new BadRequestException('Tải ảnh lên thất bại.');
    }
  }

  async findAll() {
    return await this.plantModel.find();
  }

  async findOne(plantId: string) {
    const plant = await this.plantModel.findById(plantId);

    if (!plant) {
      throw new NotFoundException('Không tìm thấy cây trồng');
    }

    return plant;
  }

  async update(
    plantId: string,
    updatePlantDto: UpdatePlantDto,
    image?: Express.Multer.File,
  ) {
    const plant = await this.plantModel.findById(plantId);

    if (!plant) {
      throw new NotFoundException('Không tìm thấy cây trồng.');
    }

    //Check duplicate name
    if (updatePlantDto.name && updatePlantDto.name.trim() !== plant.name) {
      const existingPlant = await this.plantModel.findOne({
        name: { $regex: '^' + updatePlantDto.name.trim() + '$', $options: 'i' },
      });

      if (existingPlant) {
        throw new ConflictException('Cây trồng đã tồn tại.');
      }
    }

    // Update without image
    if (!image) {
      const currentImg = plant.image;
      return this.plantModel.updateOne(
        { _id: plantId },
        { ...updatePlantDto, image: currentImg },
      );
    }

    // Update with new image
    try {
      if (image) {
        const imageUrl = (await this.filesService.uploadImage(image)) as string;
        console.log(imageUrl);
        return this.plantModel.updateOne(
          { _id: plantId },
          { ...updatePlantDto, image: imageUrl },
        );
      }
    } catch (error) {
      throw new BadRequestException('Cập nhật cây trồng thất bại.');
    }
  }

  async remove(plantId: string) {
    const plant = await this.plantModel.findById(plantId);

    if (!plant) {
      throw new NotFoundException('Không tìm thấy cây trồng.');
    }
    return this.plantModel.deleteOne({ _id: plantId });
  }
}
