import { IsEmail, IsEnum, IsString, MinLength, ValidateIf, Matches } from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserType)
  type: UserType;

  @ValidateIf(o => o.type === UserType.REQUESTER)
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'CPF must be exactly 11 digits',
  })
  cpf?: string;

  @ValidateIf(o => o.type === UserType.REQUESTER)
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Phone must be 10 or 11 digits',
  })
  phone?: string;
}
