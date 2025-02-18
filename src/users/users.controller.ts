import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from '@prisma/client';
import { UserResponse } from './types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req): Promise<UserResponse[]> {
    if (req.user.type !== UserType.ATTENDANT) {
      throw new ForbiddenException('Only attendants can list all users');
    }
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserResponse> {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string, 
    @Request() req
  ): Promise<UserResponse> {
    if (req.user.type !== UserType.ATTENDANT && req.user.id !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ): Promise<UserResponse> {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const currentUser = await this.usersService.findOne(id);
    if (currentUser.type === UserType.REQUESTER && !updateUserDto.phone) {
      throw new ForbiddenException('Phone number is required for requesters');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string, 
    @Request() req
  ): Promise<void> {
    if (req.user.type !== UserType.ATTENDANT) {
      throw new ForbiddenException('Only attendants can remove users');
    }

    await this.usersService.remove(id);
  }

  @Post('check-availability')
  async checkAvailability(
    @Body('email') email?: string,
    @Body('cpf')  cpf?: string
  ) {
    const result: { email?: boolean; cpf?: boolean } = {};

    if (email) {
      const userByEmail = await this.usersService.findByEmail(email);
      result.email = !userByEmail;
    }

    if (cpf) {
      const userByCpf = await this.usersService.findByCpf(cpf);
      result.cpf = !userByCpf;
    }

    return result;
  }
}
