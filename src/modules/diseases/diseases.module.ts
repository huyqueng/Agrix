import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Disease, DiseaseSchema } from './entities/disease.entity';
import { Plant, PlantSchema } from '@modules/plants/entities/plant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }]),
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  ],
  controllers: [DiseasesController],
  providers: [DiseasesService],
})
export class DiseasesModule {}
