import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { SKIP_JWT_GUARD_KEY } from '@/common/decorators/skip-jwt-guard.decorator';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  const reflector = new Reflector();
  const guard = new JwtAuthGuard(reflector);
  const mockExecutionContext = {
    getClass: jest.fn().mockReturnValue('GET_CLASS'),
    getHandler: jest.fn().mockReturnValue('GET_HANDLER'),
  } as unknown as ExecutionContext;

  it('should return true if guard is marked as skipped', () => {
    const reflectorSpy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => true);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBeTruthy();
    expect(reflectorSpy).toHaveBeenCalledWith(SKIP_JWT_GUARD_KEY, [
      mockExecutionContext.getHandler(),
      mockExecutionContext.getClass(),
    ]);
  });

  it('should call super.canActivate if route does not skip guard', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const superSpy = jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValue(true);

    guard.canActivate(mockExecutionContext);

    expect(superSpy).toHaveBeenCalledWith(mockExecutionContext);
  });
});
