import {
  BadRequestException,
  ConflictException,
  Inject,
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

@Injectable()
export class DiseasesService {
  constructor(
    @InjectModel(Disease.name) private diseaseModel: Model<Disease>,
    private readonly filesService: FilesService,
    @InjectModel(Plant.name) private readonly plantModel: Model<Plant>,
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
      .findById(creatediseaseDto.plantId)
      .select('name');
    console.log(plant);
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

      // const newDisease = await this.diseaseModel.create({
      //   ...creatediseaseDto,
      //   plant: plant._id,
      //   images: imgUrls,
      // });

      return await this.diseaseModel.create({
        ...creatediseaseDto,
        plantId: plant._id,
        // plantName: plant.name,
        images: imgUrls,
      });
    } catch (error) {
      throw new BadRequestException('Tải ảnh lên thất bại.');
    }
  }

  findAll(plantId: string) {
    return this.diseaseModel.find({ plantId: plantId });
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
