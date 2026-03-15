import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  const reflector = new Reflector();
  const guard = new JwtAuthGuard(reflector);
  const mockExecutionContext = {
    getClass: jest.fn().mockReturnValue('GET_CLASS'),
    getHandler: jest.fn().mockReturnValue('GET_HANDLER'),
  } as unknown as ExecutionContext;

  it('should return true if route is mark as public', () => {
    const reflectorSpy = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockImplementation(() => true);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBeTruthy();
    expect(reflectorSpy).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockExecutionContext.getHandler(),
      mockExecutionContext.getClass(),
    ]);
  });

  it('should call super.canActivate is route is not public', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const superSpy = jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValue(true);

    guard.canActivate(mockExecutionContext);

    expect(superSpy).toHaveBeenCalledWith(mockExecutionContext);
  });
});
