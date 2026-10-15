import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResendOtpDto {
  @ApiProperty({
    description: "The temptoken from the previous login attempt"})
  @IsString()
  tempToken: string;
  }