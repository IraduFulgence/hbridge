import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import { PrismaModule } from './prisma/prisma.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[configuration],
      envFilePath: ['.env']
    }),
    
    HealthModule,
    PrismaModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
