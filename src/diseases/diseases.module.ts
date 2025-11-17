import { Module } from '@nestjs/common';
import { DiseasesService } from './diseases.service';
import { DiseasesController } from './diseases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Disease, DiseaseSchema } from './schemas/disease.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Disease.name, schema: DiseaseSchema }]),
  ],
  controllers: [DiseasesController],
  providers: [DiseasesService],
})
export class DiseasesModule {}
