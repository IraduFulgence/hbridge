import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScreeningsService } from './screening.service.js';
import { CreateScreeningDto } from './dto/create-screening.dto.js';
import { Roles, RolesMessage } from '../../common/decorators/role.decorator.js';
import { userRole } from '../../common/constants/roles.enum.js';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator.js';

@ApiTags('screenings')
@ApiBearerAuth()
@Controller('screenings')
export class ScreeningsController {
  constructor(private readonly screenings: ScreeningsService) {}

  @Post()
  @Roles(userRole.CHW, userRole.NURSE, userRole.ADMIN)
  @RolesMessage('Only CHWs, nurses, and administrators can record screenings.')
  @ApiOperation({ summary: 'Record a new screening' })
  create(
    @Body() dto: CreateScreeningDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.screenings.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'List screenings' })
  findAll(
    @CurrentUser() currentUser: AuthUser,
    @Query('individualId') individualId?: string,
  ) {
    return this.screenings.findAll(currentUser, individualId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a screening by ID' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.screenings.findOne(id, currentUser);
  }
}