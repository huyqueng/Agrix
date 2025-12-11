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

      return await this.diseaseModel.create({
        ...creatediseaseDto,
        plantId: plant._id,
        images: imgUrls,
      });
    } catch (error) {
      throw new BadRequestException('Tải ảnh lên thất bại.');
    }
  }

  findAll(plantId: string) {
    const plant = this.plantModel.findById(plantId);
    if (!plant) {
      throw new NotFoundException('Cây trồng không tồn tại.');
    }
    return this.diseaseModel.find({ plantId: plantId });
  }

  findOne(id: string) {
    const disease = this.diseaseModel.findById(id);
    if (!disease) {
      throw new NotFoundException('Bệnh không tồn tại.');
    }
    return disease;
  }

  async update(
    dieaseId: string,
    updateDiseaseDto: UpdateDiseaseDto,
    images?: Express.Multer.File[],
  ) {
    const disease = await this.diseaseModel.findById(dieaseId);

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
        { _id: dieaseId },
        { ...updateDiseaseDto, images: currentImgs },
      );
    }

    // Update with new images
    try {
      if (images) {
        const imageUrls = (await this.filesService.uploadImages(
          images,
        )) as string[];

        return this.diseaseModel.updateOne(
          { _id: dieaseId },
          { ...updateDiseaseDto, image: imageUrls },
        );
      }
    } catch (error) {
      throw new BadRequestException('Cập nhật bệnh cây trồng thất bại.');
    }
  }

  remove(diseaseId: string) {
    return this.diseaseModel.deleteOne({ _id: diseaseId });
  }
}
