import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmergenciesService } from './emergencies.service';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emergencies')
@UseGuards(JwtAuthGuard)
export class EmergenciesController {
  constructor(private readonly emergenciesService: EmergenciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createEmergencyDto: CreateEmergencyDto,
    @Request() req,
  ) {
    return this.emergenciesService.create(createEmergencyDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.emergenciesService.findAll(req.user.id, req.user.type);
  }

  @Get('statistics')
  getStatistics(@Request() req) {
    return this.emergenciesService.getStatistics(req.user.type, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emergenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmergencyDto: UpdateEmergencyDto,
    @Request() req,
  ) {
    return this.emergenciesService.update(
      id,
      updateEmergencyDto,
      req.user.id,
      req.user.type,
    );
  }
}
