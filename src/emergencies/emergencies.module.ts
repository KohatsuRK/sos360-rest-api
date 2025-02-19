import { Module } from '@nestjs/common';
import { EmergenciesController } from './emergencies.controller';
import { EmergenciesService } from './emergencies.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  controllers: [EmergenciesController],
  providers: [EmergenciesService, NotificationGateway],
})
export class EmergenciesModule {}
