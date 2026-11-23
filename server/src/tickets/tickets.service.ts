import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(query: QueryTicketDto) {
    const { status, search } = query;

    const where: Prisma.TicketWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { deviceName: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { issue: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return this.prisma.ticket.findMany({
      where,
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
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  private async verifyOwnership(ticketId: number, userId: number) {
    const ticket = await this.findOne(ticketId);
    if (ticket.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this ticket');
    }
    return ticket;
  }

  async update(id: number,userId: number, dto: UpdateTicketDto) {
    await this.verifyOwnership(id, userId);
    return this.prisma.ticket.update({
      where: {id},
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.verifyOwnership(id, userId);
    return this.prisma.ticket.delete({
      where: {id},
    });
  }
}
