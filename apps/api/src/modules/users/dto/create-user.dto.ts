import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '../../../common/constants/roles.enum.js';

export class CreateUserDto {
  @ApiProperty({ example: '+250788000010' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'newuser@hbridge.rw', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Habimana' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: userRole, example: userRole.CHW })
  @IsEnum(userRole)
  role: userRole;

  @ApiProperty({ example: 'Gasabo', required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: 'Remera', required: false })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({ required: false, description: 'Supervisor user ID (for CHWs)' })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;
}