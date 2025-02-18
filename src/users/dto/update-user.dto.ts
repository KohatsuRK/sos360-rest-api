import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'type', 'cpf'] as const),
) {
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Phone must be 10 or 11 digits',
  })
  phone?: string;
}
