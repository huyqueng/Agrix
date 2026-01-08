import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { HttpModule } from '@nestjs/axios';
import { Diagnosis, DiagnosisSchema } from './entities/diagnosis.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from 'shared/counter.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Diagnosis.name, schema: DiagnosisSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
})
export class DiagnosisModule {}
