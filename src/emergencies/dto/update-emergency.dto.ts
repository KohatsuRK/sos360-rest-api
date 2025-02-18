import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateEmergencyDto {
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
