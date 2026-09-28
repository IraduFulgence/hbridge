import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  // put all api endpoints under /api/v1/
  app.setGlobalPrefix('api/v1');
  const port = config.get<number>('app.port',3001);
  const appName = config.get<string>('app.name','Hbridge');
  await app.listen(port);
  Logger.log(` ${appName} API running on ${port}`);
  Logger.log(`Health check: http://localhost:${port}/api/v1/health`);
}
await bootstrap();
