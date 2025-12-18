import { Module } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Plant, PlantSchema } from './entities/plant.entity';
import { FilesModule } from '@modules/files/files.module';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { Connection, Mongoose } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: Plant.name,
    //     useFactory: (connection: Connection) => {
    //       const schema = PlantSchema;
    //       schema.plugin(AutoIncrementID, {
    //         field: 'plantId', // Tên field cần auto-increment
    //         startAt: 1, // Bắt đầu từ 1
    //         incrementBy: 1, // Tăng 1 mỗi lần
    //       });
    //       return schema;
    //     },
    //     inject: [getConnectionToken()], // Inject connection mặc định
    //   },
    // ]),
    // FilesModule,
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
  // exports: [
  //   MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  // ],
})
export class PlantsModule {}
