import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      orderBy: {createdAt: 'desc'},
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
      },
    })
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: {id},
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto) {
    await this.findOne(id); // Ensure the ticket exists before updating
    return this.prisma.ticket.update({
      where: {id},
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure the ticket exists before deleting
    return this.prisma.ticket.delete({
      where: {id},
    });
  }
}
