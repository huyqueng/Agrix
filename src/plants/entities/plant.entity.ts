import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Plant {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ required: true, trim: true })
  imageUrl: string;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
