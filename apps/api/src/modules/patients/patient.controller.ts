import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';

import { Roles,RolesMessage } from '../../common/decorators/role.decorator.js';
import { userRole } from '../../common/constants/roles.enum.js';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator.js';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Post()
  @Roles(userRole.CHW, userRole.NURSE, userRole.ADMIN)
  @RolesMessage(
    'Only community health workers, nurses, and administrators can register patients.',
  )
  @ApiOperation({ summary: 'Create a new patient' })
  create(
    @Body() dto: CreatePatientDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.patients.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'List patients (scoped by role)' })
  findAll(@CurrentUser() currentUser: AuthUser) {
    return this.patients.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID (ownership enforced)' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    return this.patients.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(userRole.CHW, userRole.NURSE, userRole.ADMIN)
  @RolesMessage(
    'Only community health workers, nurses, and administrators can update patient records.',
  )
  @ApiOperation({ summary: 'Update a patient (ownership enforced)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    return this.patients.update(id, dto, currentUser);
  }
}