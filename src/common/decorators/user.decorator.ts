import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthJwtPayload } from '../../auth/types/auth-jwt-payload';
import type { Request } from 'express';

export const User = createParamDecorator(
  (userField: keyof AuthJwtPayload | undefined, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const user: AuthJwtPayload | undefined = req.user as any;

    if (!user) {
      throw new UnauthorizedException('O usuário não está autenticado');
    }

    return userField ? user[userField] : user;
  },
);
