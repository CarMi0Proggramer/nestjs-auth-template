import { Test, TestingModule } from '@nestjs/testing';
import { RefreshJwtStrategy } from './refresh.strategy';
import { AuthService } from '../../auth.service';
import { AuthJwtPayload } from '../../types/auth-jwt-payload';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        {
          provide: AuthService,
          useValue: {
            validateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should validate refresh token successfully', async () => {
    const payload: AuthJwtPayload = { sub: 'USER_ID' };
    const refreshToken = 'REFRESH_TOKEN';
    const req = {
      get: jest.fn().mockReturnValue(`Bearer ${refreshToken}`),
    } as unknown as Request;

    await strategy.validate(req, payload);

    expect(authService.validateRefreshToken).toHaveBeenCalledWith(
      payload.sub,
      refreshToken,
    );
  });

  it('should throw UnauthorizedException if refresh token is not provided', () => {
    const payload: AuthJwtPayload = { sub: 'USER_ID' };
    const req = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Request;

    expect(() => strategy.validate(req, payload)).toThrow(
      new UnauthorizedException('Refresh token não fornecido'),
    );
  });
});
