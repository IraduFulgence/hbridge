import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScreeningType } from '../../../generated/prisma/client.js';

export class CreateScreeningDto {
  @ApiProperty({ description: 'Patient  ID' })
  @IsUUID()
  individualId: string;

  @ApiProperty({ enum: ScreeningType, example: ScreeningType.PHQ9 })
  @IsEnum(ScreeningType)
  screeningType: ScreeningType;

  @ApiProperty({
    description: 'Raw responses, shape depends on screeningType',
    example: {
      q1: 1,
      q2: 2,
      q3: 1,
      q4: 0,
      q5: 1,
      q6: 2,
      q7: 1,
      q8: 0,
      q9: 0,
    },
  })
  @IsObject()
  responses: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}