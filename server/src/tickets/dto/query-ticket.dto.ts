import { TicketStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryTicketDto {
    @IsEnum(TicketStatus)
    @IsOptional()
    status?: TicketStatus;

    @IsString()
    @IsOptional()
    search?: string;
}
