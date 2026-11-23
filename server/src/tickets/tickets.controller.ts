import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { CurrentUser, type JwtUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Post()
    create(
        @CurrentUser() user: JwtUser,
        @Body() createTicketDto: CreateTicketDto
    ) {
        return this.ticketsService.create(user.userId, createTicketDto);
    }

    @Get()
    findAll(@Query() query: QueryTicketDto) {
        return this.ticketsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtUser,
        @Body() updateTicketDto: UpdateTicketDto,
    ) {
        return this.ticketsService.update(id, user.userId, updateTicketDto);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtUser,
    ) {
        return this.ticketsService.remove(id, user.userId);
    }
}
