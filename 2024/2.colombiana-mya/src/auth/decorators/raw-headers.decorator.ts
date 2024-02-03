import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetHeaders = createParamDecorator((_, ctx: ExecutionContext) => {
  const data = ctx.switchToHttp().getRequest().headers;

  return data;
});
