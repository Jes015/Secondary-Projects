export const CValidRoles = {
  admin: 'admin',
  superUser: 'superUser',
  user: 'user',
} as const;

export type TValidRole = (typeof CValidRoles)[keyof typeof CValidRoles];

export type TValidRoleArray = TValidRole[];
