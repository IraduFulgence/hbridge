import { Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';

@Global()
@Module({
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}