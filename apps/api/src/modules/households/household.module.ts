import { Module } from '@nestjs/common';
import { HouseholdServices } from './household.service';
import { HouseholdController } from './house.controller';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdServices],
  exports: [HouseholdServices],
})
export class HouseholdsModule {}