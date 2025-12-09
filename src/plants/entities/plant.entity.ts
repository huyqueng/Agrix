import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Plant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ required: true, trim: true })
  image: string;

  // @Prop({ type: Array, default: [] })
  // diseases: Object[];
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
