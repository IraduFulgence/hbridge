import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator.js';
import { userRole } from '../constants/roles.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    // Read the roles required by this route from @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<userRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

     // If no roles are required, allow the request
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    //Get the authenticated user 
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user context');
    }

    //Check if the user's role is in the required list
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Unauthorized!`,
      );
    }

    return true;
  }
}