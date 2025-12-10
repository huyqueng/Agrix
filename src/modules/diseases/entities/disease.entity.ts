import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Disease {
  @Prop()
  name: string;

  @Prop()
  symptoms: string;

  @Prop()
  treatment: string;

  @Prop()
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' })
  plantId: mongoose.Schema.Types.ObjectId;

  // @Prop()
  // plantName: string;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
