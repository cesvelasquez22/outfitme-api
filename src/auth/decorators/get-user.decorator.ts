import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { JwtPayload } from '../auth.types';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  console.log({ data });

  const req = ctx.switchToHttp().getRequest();
  const user: JwtPayload = req.user;
  if (!user) {
    throw new InternalServerErrorException('Request: User not found');
  }
  if (data in user) {
    return user[data];
  } else {
    return user;
  }
});
