import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../modules/redis/redis.service.js';
import * as crypto from 'crypto';

interface OtpData {
  hash: string;
  attempts: number;
  createdAt: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly hmacSecret: string;
  private readonly ttl: number = 300;
  private readonly maxAttempts: number = 3;
  private readonly otpLength: number = 6;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const secret = this.config.get<string>('otp.hmacSecret');
    if (!secret) {
      throw new Error('OTP_HMAC_SECRET is not set in .env');
    }
    this.hmacSecret = secret;
    this.logger.log('Custom OTP Service initialized');
  }

  private getKey(phone: string, intent: string): string {
    return `otp:${intent}:${phone}`;
  }

  private hashOtp(otp: string): string {
    return crypto
      .createHmac('sha256', this.hmacSecret)
      .update(otp)
      .digest('hex');
  }

  private generateRandomOtp(): string {
    const min = Math.pow(10, this.otpLength - 1);
    const max = Math.pow(10, this.otpLength) - 1;
    return crypto.randomInt(min, max + 1).toString();
  }

  async generateOtp(phone: string, intent: string): Promise<string> {
    const key = this.getKey(phone, intent);
    const otp = this.generateRandomOtp();
    const hash = this.hashOtp(otp);

    const data: OtpData = {
      hash,
      attempts: 0,
      createdAt: Date.now(),
    };

    await this.redis.client.setex(key, this.ttl, JSON.stringify(data));

    this.logger.log(`OTP generated for ${phone} (intent: ${intent})`);
    this.logger.debug(`[DEV] Generated OTP: ${otp}`);

    return otp;
  }

  async verifyOtp(phone: string, otp: string, intent: string): Promise<boolean> {
    const key = this.getKey(phone, intent);
    const raw = await this.redis.client.get(key);

    if (!raw) {
      this.logger.warn(`No OTP found for ${phone} (intent: ${intent})`);
      return false;
    }

    const data: OtpData = JSON.parse(raw);

    if (data.attempts >= this.maxAttempts) {
      await this.redis.client.del(key);
      this.logger.warn(`Max attempts exceeded for ${phone}`);
      throw new BadRequestException('Maximum verification attempts exceeded');
    }

    const inputHash = this.hashOtp(otp);

    if (inputHash !== data.hash) {
      data.attempts += 1;
      const remainingTtl = await this.redis.client.ttl(key);
      const ttlToUse = remainingTtl > 0 ? remainingTtl : this.ttl;
      await this.redis.client.setex(key, ttlToUse, JSON.stringify(data));
      this.logger.warn(
        `Invalid OTP for ${phone}. Attempt ${data.attempts}/${this.maxAttempts}`,
      );
      return false;
    }

    await this.redis.client.del(key);
    this.logger.log(`OTP verified for ${phone}`);
    return true;
  }
}