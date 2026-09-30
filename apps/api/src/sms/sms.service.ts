import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private atClient: any;

  constructor(private readonly config: ConfigService) {
    const username = this.config.get<string>('sms.username', 'sandbox');
    const apiKey = this.config.get<string>('sms.apiKey');

    if (apiKey) {
      const AfricasTalking = require('africastalking');
      this.atClient = AfricasTalking({ username, apiKey });
      this.logger.log(`Africa's Talking initialized (${username})`);
    } else {
      this.logger.warn("Africa's Talking API key not set,SMS will be logged only");
    }
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    const normalized = this.normalizePhone(phoneNumber);

    if (!normalized) {
      this.logger.error(`Invalid Rwandan phone number: ${phoneNumber}`);
      return false;
    }

    if (!this.atClient) {
      this.logger.log(`[DEV SMS] To: ${normalized} | Message: ${message}`);
      return true;
    }

    try {
      const result = await this.atClient.SMS.send({
        to: [normalized],
        message,
        from: this.config.get<string>('sms.senderId', 'HBRIDGE'),
      });

      this.logger.log(`SMS sent to ${normalized}: ${JSON.stringify(result)}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`SMS failed to ${normalized}: ${errorMessage}`);
      return false;
    }
  }

  normalizePhone(phoneNumber: string): string | null {
    // Strip everything except digits and leading +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Remove leading +
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }

    // Strip Rwanda country code if present
    if (cleaned.startsWith('250')) {
      cleaned = cleaned.substring(3);
    }

    // Valid Rwandan mobile prefixes: 072, 073, 078, 079
    // So the number should start with 72, 73, 78, or 79
    if (!/^7[2389]\d{7}$/.test(cleaned)) {
      this.logger.error(`Invalid Rwandan mobile number: ${phoneNumber}`);
      return null;
    }

    return `+250${cleaned}`;
  }
}