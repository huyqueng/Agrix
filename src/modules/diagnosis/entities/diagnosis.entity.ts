import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Diagnosis {
  @Prop({ unique: true, trim: true })
  diagnosisId: number;

  @Prop()
  userId: number;

  @Prop()
  plantId: number;

  @Prop()
  diseaseId: number;

  @Prop()
  status: string;

  @Prop()
  createdAt: Date;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
