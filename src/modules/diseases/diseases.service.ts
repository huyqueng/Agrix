import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Disease } from './entities/disease.entity';
import { Model } from 'mongoose';
import { FilesService } from '@modules/files/files.service';
import { Plant } from '@modules/plants/entities/plant.entity';
import { Counter } from 'shared/counter.entity';
import { paginate } from 'shared/pagination.util';

@Injectable()
export class DiseasesService {
  constructor(
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
    private readonly filesService: FilesService,
    @InjectModel(Plant.name) private readonly plantModel: Model<Plant>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}
  //create disease
  async create(
    creatediseaseDto: CreateDiseaseDto,
    images: Express.Multer.File[],
  ) {
    //Check duplicate disease name
    const existingDisease = await this.diseaseModel.findOne({
      name: {
        $regex: '^' + creatediseaseDto.name.trim() + '$',
        $options: 'i',
      },
    });
    if (existingDisease) {
      throw new ConflictException('Bệnh đã tồn tại.');
    }

    const plant = await this.plantModel
      .findOne({ plantId: creatediseaseDto.plantId })
      .select('name');
    if (!plant) {
      throw new NotFoundException('Cây trồng không tồn tại.');
    }

    if (!images) {
      throw new BadRequestException('Vui lòng gửi ảnh của bệnh.');
    }

    try {
      const imgUrls = (await this.filesService.uploadImages(
        images,
      )) as string[];

      const counter = await this.counterModel.findOneAndUpdate(
        { _id: 'diseaseId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      return await this.diseaseModel.create({
        diseaseId: counter.seq,
        ...creatediseaseDto,
        plantId: creatediseaseDto.plantId,
        images: imgUrls,
      });
    } catch (error) {
      throw new BadRequestException('Tải ảnh lên thất bại.');
    }
  }

  findAll(currentPage: number = 1, limit: number = 10) {
    return paginate(this.diseaseModel, currentPage, limit);
  }

  async getDiseasesByPlant(
    currentPage: number = 1,
    limit: number = 10,
    plantId: number,
  ) {
    const plant = await this.plantModel.findOne({ plantId });
    if (!plant) {
      throw new NotFoundException('Cây trồng không tồn tại.');
    }
    return paginate(this.diseaseModel, currentPage, limit, { plantId });
  }

  findOne(diseaseId: number) {
    const disease = this.diseaseModel.findOne({ diseaseId });
    if (!disease) {
      throw new NotFoundException('Bệnh không tồn tại.');
    }
    return disease;
  }

  async update(
    diseaseId: number,
    updateDiseaseDto: UpdateDiseaseDto,
    images?: Express.Multer.File[],
  ) {
    const disease = await this.diseaseModel.findOne({ diseaseId });
    if (!disease) {
      throw new NotFoundException('Không tìm thấy bệnh cây trồng.');
    }

    //Check duplicate name
    if (
      updateDiseaseDto.name &&
      updateDiseaseDto.name.trim() !== disease.name
    ) {
      const existingDisease = await this.plantModel.findOne({
        name: {
          $regex: '^' + updateDiseaseDto.name.trim() + '$',
          $options: 'i',
        },
      });

      if (existingDisease) {
        throw new ConflictException('Bệnh đã tồn tại.');
      }
    }

    // Update without images
    if (!images) {
      const currentImgs = disease.images;
      return this.diseaseModel.updateOne(
        { diseaseId },
        {
          ...updateDiseaseDto,
          images: currentImgs,
        },
      );
    }
    try {
      const imageUrls = (await this.filesService.uploadImages(
        images,
      )) as string[];

      return this.diseaseModel.updateOne(
        { diseaseId },
        {
          ...updateDiseaseDto,
          images: imageUrls,
        },
      );
    } catch (error) {
      throw new BadRequestException('Cập nhật bệnh cây trồng thất bại.');
    }
  }

  async remove(diseaseId: number) {
    const disease = await this.diseaseModel.findOne({ diseaseId });
    if (!disease) {
      throw new NotFoundException('Không tìm thấy bệnh cây trồng.');
    }
    return this.diseaseModel.deleteOne({ diseaseId });
  }
}
