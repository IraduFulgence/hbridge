import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { OtpService } from '../../otp/otp.service.js';
import { SmsService } from '../../sms/sms.service.js';
import { LoginDTO } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';

const OTP_INTENT_LOGIN = '2fa-login';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly otp: OtpService,
    private readonly sms: SmsService,
  ) {}

  async login(dto: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Password is correct — now send OTP
    const otp = await this.otp.generateOtp(user.phone, OTP_INTENT_LOGIN);

    const sent = await this.sms.sendSms(
      user.phone,
      `Your HBridge verification code is: ${otp}. It expires in 5 minutes.`,
    );

    if (!sent) {
      throw new BadRequestException('Failed to send verification code');
    }

    // Issue a short-lived temp token
    const tempExpiresIn = (this.config.get<string>('jwt.tempExpiresIn') ?? '5m') as any;
    const tempToken = await this.jwt.signAsync(
      { sub: user.id, phone: user.phone, purpose: 'otp-verification' },
      {
        secret: this.config.get<string>('jwt.tempSecret'),
        expiresIn: tempExpiresIn,
      },
    );

    return {
      message: 'Verification code sent to your phone',
      tempToken,
      requiresOtp: true,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // Verify the temp token
    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(dto.tempToken, {
        secret: this.config.get<string>('jwt.tempSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired temp token');
    }

    if (payload.purpose !== 'otp-verification') {
      throw new UnauthorizedException('Invalid token purpose');
    }

    // Fetch the user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify the OTP
    const isValid = await this.otp.verifyOtp(
      user.phone,
      dto.code,
      OTP_INTENT_LOGIN,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    this.logger.log(`User logged in with 2FA: ${user.phone}`);

    return this.issueTokens(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        district: dto.district,
        sector: dto.sector,
      },
    });

    this.logger.log(`New user registered: ${user.phone} (${user.role})`);

    // Auto-login after registration (send OTP)
    const otp = await this.otp.generateOtp(user.phone, OTP_INTENT_LOGIN);
    await this.sms.sendSms(
      user.phone,
      `Welcome to HBridge! Your verification code is: ${otp}. It expires in 5 minutes.`,
    );

    const tempExpiresIn = (this.config.get<string>('jwt.tempExpiresIn') ?? '5m') as any;
    const tempToken = await this.jwt.signAsync(
      { sub: user.id, phone: user.phone, purpose: 'otp-verification' },
      {
        secret: this.config.get<string>('jwt.tempSecret'),
        expiresIn: tempExpiresIn,
      },
    );

    return {
      message: 'Registration successful. Verification code sent to your phone.',
      tempToken,
      requiresOtp: true,
    };
  }

  private async issueTokens(user: {
    id: string;
    phone: string;
    email: string | null;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.secret'),
        expiresIn: this.config.get<string>('jwt.expiresIn') as any,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn') as any,
      }),
    ]);

    return {
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}