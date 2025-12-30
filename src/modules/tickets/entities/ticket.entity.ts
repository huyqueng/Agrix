import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Ticket {
  @Prop({ unique: true })
  ticketId: number;

  @Prop()
  userId: number;

  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  content: string;

  @Prop({ default: [] })
  images?: string[];

  @Prop()
  status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
