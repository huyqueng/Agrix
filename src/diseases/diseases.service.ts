import { Injectable } from '@nestjs/common';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Disease } from './schemas/disease.schema';
import { Model } from 'mongoose';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
  ) {}
  async create(createDiseaseDto: CreateDiseaseDto) {
    return await this.diseaseModel.create(createDiseaseDto);
  }

  findAll() {
    return `This action returns all diseases`;
  }

  findOne(id: string) {
    return this.diseaseModel.findById(id);
  }

  update(id: number, updateDiseaseDto: UpdateDiseaseDto) {
    return `This action updates a #${id} disease`;
  }

  remove(id: number) {
    return `This action removes a #${id} disease`;
  }
}
