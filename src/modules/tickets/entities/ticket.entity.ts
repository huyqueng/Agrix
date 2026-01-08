import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { TicketStatus } from '../tickets.service';

export enum TicketStatus {
  OPEN = 'Mới',
  IN_PROGRESS = 'Đang xử lý',
  RESOLVED = 'Đã xử lý',
  REJECTED = 'Từ chối',
}
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

  @Prop({ enum: TicketStatus, default: TicketStatus.OPEN })
  status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
