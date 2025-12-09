import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
  image_urls: string[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' })
  // plant_id: mongoose.Schema.Types.ObjectId;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
