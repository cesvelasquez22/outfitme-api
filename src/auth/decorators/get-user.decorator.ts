import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: User = req.user;
  if (!user) {
    throw new InternalServerErrorException('Request: User not found');
  }
  if (data in user) {
    return user[data];
  } else {
    return user;
  }
});
