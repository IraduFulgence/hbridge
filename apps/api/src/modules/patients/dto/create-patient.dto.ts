import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../generated/prisma/client.js';

export class CreatePatientDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Habimana' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 45, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  age?: number;

  @ApiProperty({ example: '+250788123456', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1199870012345678', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: 'Kigali', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Nyarugenge', required: false, description: 'Village name for household' })
  @IsOptional()
  @IsString()
  village?: string;

  @ApiProperty({ example: 'Head of Family', required: false })
  @IsOptional()
  @IsString()
  headName?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  hasHypertension?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  hasDiabetes?: boolean;

  @ApiProperty({ example: false, required: true })
  @IsString()
  headId?: string;

}