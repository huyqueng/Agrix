import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Plant, PlantSchema } from './entities/plant.entity';
import { FilesModule } from 'files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
    FilesModule,
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
