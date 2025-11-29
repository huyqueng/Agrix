import { Injectable } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { Plant } from './entities/plant.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlantsService {
  constructor(@InjectModel(Plant.name) private plantModel: Model<Plant>) {}
  create(createPlantDto: CreatePlantDto) {
    const existingPlant = this.plantModel.findOne({
      name: createPlantDto.name,
    });
    // if (existingPlant) {
    //   return;
    // }
    return this.plantModel.create(createPlantDto);
  }

  findAll() {
    return `This action returns all plants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plant`;
  }

  update(id: number, updatePlantDto: UpdatePlantDto) {
    return `This action updates a #${id} plant`;
  }

  remove(id: number) {
    return `This action removes a #${id} plant`;
  }
}
