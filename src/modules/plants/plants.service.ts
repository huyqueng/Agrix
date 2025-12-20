import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './entities/plant.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from '../../shared/counter.entity';
import { paginate } from 'shared/pagination.util';

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private plantModel: Model<Plant>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}

  async create(createPlantDto: CreatePlantDto) {
    const existingPlant = await this.plantModel.findOne({
      name: { $regex: '^' + createPlantDto.name.trim() + '$', $options: 'i' },
    });

    if (existingPlant) {
      throw new ConflictException('Cây trồng đã tồn tại.');
    }
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'plantId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return this.plantModel.create({
      plantId: counter.seq,
      ...createPlantDto,
    });
  }

  async findAll(currentPage: number = 1, limit: number = 10) {
    return paginate(this.plantModel, currentPage, limit);
  }

  async findOne(plantId: string) {
    const plant = await this.plantModel.findById(plantId);
    if (!plant) {
      throw new NotFoundException('Không tìm thấy cây trồng');
    }
    return plant;
  }

  async update(plantId: number, updatePlantDto: UpdatePlantDto) {
    const plant = await this.plantModel.findOne({ plantId });

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

    return this.plantModel.updateOne({ plantId }, updatePlantDto);
  }

  async remove(plantId: string) {
    const plant = await this.plantModel.findOne({ plantId });

    if (!plant) {
      throw new NotFoundException('Không tìm thấy cây trồng.');
    }
    return this.plantModel.deleteOne({ plantId });
  }
}
