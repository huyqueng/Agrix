import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Disease {
  @Prop()
  diseaseId: number;

  @Prop()
  name: string;

  @Prop()
  symptoms: string;

  @Prop()
  treatment: string;

  @Prop()
  images: string[];

  @Prop()
  plantId: number;

  // @Prop()
  // plantName: string;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
