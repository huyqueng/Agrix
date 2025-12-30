import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { IUSer } from '@modules/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { FilesService } from '@modules/files/files.service';

enum TicketStatus {
  OPEN = 'open',
  PENDING = 'pending',
  CLOSED = 'closed',
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private filesService: FilesService,
  ) {}
  async create(
    user: IUSer,
    createTicketDto: CreateTicketDto,
    images: Express.Multer.File[],
  ) {
    const imageUrls = await this.filesService.uploadImages(images);

    return this.ticketModel.create({
      ...createTicketDto,
      userId: user.userId,
      images: imageUrls,
    });
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
