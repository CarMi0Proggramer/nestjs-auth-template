import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SKIP_JWT_GUARD_KEY } from '@/common/decorators/skip-jwt-guard.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_JWT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkip) return true;

    return super.canActivate(context);
  }
}
