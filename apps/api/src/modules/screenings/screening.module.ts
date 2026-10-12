import { Module } from '@nestjs/common';
import { ScreeningsService } from './screening.service.js';
import { ScreeningsController } from './screening.controller.js';
import { ScoringEngine } from './engines/scoring.engine.js';

@Module({
  controllers: [ScreeningsController],
  providers: [ScreeningsService, ScoringEngine],
  exports: [ScreeningsService, ScoringEngine],
})
export class ScreeningsModule {}