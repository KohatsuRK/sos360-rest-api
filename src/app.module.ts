import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmergenciesModule } from './emergencies/emergencies.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EmergenciesModule,
  ],
  providers: [PrismaService, NotificationGateway],
})
export class AppModule {}
