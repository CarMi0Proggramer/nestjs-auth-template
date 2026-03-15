import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request } from 'express';
import { User as UserEntity } from '@/entities/User';

export const getUser = (
  userField: keyof Pick<UserEntity, 'id'> | undefined,
  ctx: ExecutionContext,
) => {
  const req: Request = ctx.switchToHttp().getRequest();
  const user = req.user as Pick<UserEntity, 'id'> | undefined;

  if (!user) {
    throw new InternalServerErrorException(
      'O usuário não foi encontrado na request',
    );
  }

  return userField ? user[userField] : user;
};

export const User = createParamDecorator(getUser);
