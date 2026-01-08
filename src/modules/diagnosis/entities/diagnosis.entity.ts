import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface DetectedDisease {
  class: string;
  confidence: string;
}

export interface DiagnosisMeta {
  execution_time: string;
  is_out_of_distribution: boolean;
  uncertainty_detected: boolean;
  device: string;
  models_used: string[];
}

@Schema()
export class Diagnosis {
  @Prop({ unique: true, trim: true })
  diagnosisId: number;

  @Prop()
  userId: number;

  @Prop()
  image: string;

  @Prop()
  status: string;

  @Prop()
  detected_diseases: Object[];

  @Prop()
  full_analysis: Object[];

  @Prop({ type: Object })
  details: any;

  @Prop({ type: Object })
  meta: any;

  @Prop()
  createdAt: Date;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
