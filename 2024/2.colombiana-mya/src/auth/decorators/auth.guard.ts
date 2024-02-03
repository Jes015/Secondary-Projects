import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { TValidRoleArray } from '../models/roles.model';
import { RoleProtected } from './role-protected/role-protected.decorator';

export function Auth(...roles: TValidRoleArray) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
