import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './modules/redis/redis.module.js';
import { OtpModule } from './otp/otp.module.js';
import { SmsModule } from './sms/sms.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/role.guard.js';
import { UsersModule } from './modules/users/users.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    RedisModule,
    OtpModule,
    SmsModule,    
    AuthModule,
    HealthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}