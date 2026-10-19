import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateHouseholdDto{

    @ApiProperty({example:'UWIMANA Alphonse'})
    @IsString()
    headName:string;

    @ApiProperty({example:'11998000028888'})
    @IsString()
    headId:string;

    @ApiProperty({example:'Umurava'})
    @IsString()
    village?:string;

    @ApiProperty({example:'id'})
    @IsString()
    chwId?:string;
}