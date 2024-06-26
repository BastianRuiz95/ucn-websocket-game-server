import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const getUserFromRequestFn = (_params: any, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest().user;

  if (!user) {
    throw new InternalServerErrorException('User not found (Decorator error)');
  }

  return user;
};

export const GetUser = createParamDecorator(getUserFromRequestFn);
