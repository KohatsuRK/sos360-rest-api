import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmergenciesModule } from './emergencies/emergencies.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    EmergenciesModule,
    // AuthModule,
    PrismaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
