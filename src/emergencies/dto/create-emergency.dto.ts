import { IsEnum, IsString, IsNotEmpty, IsLatLong } from 'class-validator';
import { Service } from '@prisma/client';

export class CreateEmergencyDto {
  @IsEnum(Service)
  service: Service;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsLatLong()
  coordinates: string; // format: "latitude,longitude"
}
