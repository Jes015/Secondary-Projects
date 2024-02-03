import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected/role-protected.decorator';
import { User } from '../entities/user.entity';
import { TValidRoleArray } from '../models/roles.model';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<TValidRoleArray>(
      META_ROLES,
      context.getHandler(),
    );

    if (validRoles == null) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user as User;

    if (user == null) {
      throw new InternalServerErrorException(
        'This method needs the nest auth guard',
      );
    }

    const userHasValidRoles = validRoles.every((role) =>
      user.roles.includes(role),
    );

    if (userHasValidRoles === false) {
      const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
      });

      throw new ForbiddenException(
        `You need these roles to have access to this route: ${formatter.format(validRoles)}`,
      );
    }

    return true;
  }
}
