import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Disease {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, type: String })
  symptoms: string;

  @Prop({ required: true, type: String })
  treatment: string;

  @Prop({ type: [String], default: [] })
  image_urls: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' })
  plant_id: mongoose.Schema.Types.ObjectId;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
