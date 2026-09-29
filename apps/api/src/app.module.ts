import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[configuration],
      envFilePath: ['.env']
    }),
    
    HealthModule,
    PrismaModule,
    AuthModule,
    
   ],
  controllers: [],
  providers: [JwtAuthGuard],
})
export class AppModule {}
