import { SetMetadata } from '@nestjs/common';
import { userRole } from '../constants/roles.enum';
export const ROLES_KEY = 'roles';
export const ROLES_MESSAGE_KEY = 'roles_message';
export const Roles = (...roles: userRole[]) => SetMetadata(ROLES_KEY, roles);
export const RolesMessage = (message: string) =>
  SetMetadata(ROLES_MESSAGE_KEY, message);