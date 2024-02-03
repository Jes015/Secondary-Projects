import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

type UserKeys = 'id' | 'email' | 'fullName' | 'isActive' | 'roles';

export const GetUser = createParamDecorator(
  (userKey: UserKeys, ctx: ExecutionContext) => {
    const userData = ctx.switchToHttp().getRequest().user as User;

    const dataToReturn = userData[userKey] ?? userData;

    if (dataToReturn == null)
      throw new InternalServerErrorException(
        `Server error: user does not exits`,
      );

    return dataToReturn;
  },
);
