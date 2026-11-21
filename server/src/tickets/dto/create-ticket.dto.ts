import { TicketStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min } from "class-validator";

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  issue: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedCost?: number;

  @IsInt()
  userId: number;
}
