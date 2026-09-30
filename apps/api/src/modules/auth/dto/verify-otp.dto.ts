import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Temporary token from login response' })
  @IsString()
  tempToken: string;

  @ApiProperty({ example: '482916', description: '6-digit OTP from SMS' })
  @IsString()
  @Length(6, 6)
  code: string;
}