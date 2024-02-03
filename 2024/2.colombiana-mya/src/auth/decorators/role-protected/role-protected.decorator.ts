import { SetMetadata } from '@nestjs/common';
import { TValidRoleArray } from 'src/auth/models/roles.model';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: TValidRoleArray) => {
  return SetMetadata(META_ROLES, args);
};
