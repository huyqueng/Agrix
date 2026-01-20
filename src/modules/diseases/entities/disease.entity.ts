import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Disease {
  @Prop()
  diseaseId: number;

  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  symptoms: string;

  @Prop({ trim: true })
  treatment: string;

  @Prop()
  images: string[];

  @Prop()
  plantId: number;

  @Prop()
  plantName: string;

  @Prop()
  className: string;
}

export const DiseaseSchema = SchemaFactory.createForClass(Disease);
