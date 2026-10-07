import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Roles } from '../../common/decorators/role.decorator.js';
import { userRole } from '../../common/constants/roles.enum.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles(userRole.ADMIN)
  @ApiOperation({
    summary: 'List users',
  })
  async findAll(
    @CurrentUser() currentUser: { id: string; role: userRole },
    @Query('role') role?: userRole,
  ) {

    // ADMIN sees everyone, with optional role filter
    return this.users.findAll({ role });
  }

  @Get(':id')
  @Roles(userRole.ADMIN, userRole.CHW)
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  @Roles(userRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }
}