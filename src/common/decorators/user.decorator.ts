import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthJwtPayload } from '../../auth/types/auth-jwt-payload';
import type { Request } from 'express';

export const User = createParamDecorator(
  (userField: keyof AuthJwtPayload | undefined, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const user = req.user as AuthJwtPayload | undefined;

    if (!user) {
      throw new InternalServerErrorException(
        'O usuário não foi encontrado na request',
      );
    }

    return userField ? user[userField] : user;
  },
);
