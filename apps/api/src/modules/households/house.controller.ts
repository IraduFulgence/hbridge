import { Controller, Get, Param,Post, Body} from "@nestjs/common";
import { ApiBearerAuth,ApiOperation,ApiTags } from "@nestjs/swagger";
import { HouseholdServices } from "./household.service";
import { AuthUser,CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/role.decorator";
import { CreateHouseholdDto } from "./dto/create-household.dto";
import { userRole } from "../../common/constants/roles.enum";
@ApiTags('households')
@ApiBearerAuth()
@Controller('households')

export class HouseholdController{
    constructor(private readonly households:HouseholdServices){}

    @Get()
    @ApiOperation({summary:'List households'})
    findAll(@CurrentUser() CurrentUser:AuthUser){
        return this.households.findAll(CurrentUser);
    }
    @Get('head/:headId')
    @ApiOperation({summary:'get house by head of family ID'})
    findByHeadId(
        @Param('headId') headId:string,
        @CurrentUser() currentUser:AuthUser
    ){
        return this.households.findByHeadId(headId,currentUser);
    }


    // post route
    @Post()
    @Roles(userRole.CHW)
    @ApiOperation({summary:'create household'})
    create(
        @Body() dto:CreateHouseholdDto,
        @CurrentUser() currentUser:AuthUser
    ){
        return this.households.create(dto,currentUser);
    }
    
}