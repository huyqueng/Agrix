import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Roles, User } from 'auth/auth.decorator';
import { UserRole } from '@modules/roles/roles.service';
import { ResponseMessage } from 'common/decorators/response-message.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { IUSer } from '@modules/users/users.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create')
  @Roles(UserRole.USER)
  @ResponseMessage('Tạo ticket thành công')
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @User() user: IUSer,
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.ticketsService.create(user, createTicketDto, images);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
