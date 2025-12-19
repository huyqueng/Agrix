import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Plant, PlantSchema } from './entities/plant.entity';
import { FilesModule } from '@modules/files/files.module';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { Connection, Mongoose } from 'mongoose';

import AutoIncrementFactory from 'mongoose-sequence';
import { Counter, CounterSchema } from '../../shared/counter.entity';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
    // FilesModule,
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
  // exports: [
  //   MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  // ],
})
export class PlantsModule {}
