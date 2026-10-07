import { SetMetadata } from '@nestjs/common';
import { userRole } from '../constants/roles.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: userRole[]) => SetMetadata(ROLES_KEY, roles);