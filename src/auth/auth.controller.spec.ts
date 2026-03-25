import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { envs } from '../config/envs';

describe('AuthController', () => {
  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn(),
    refreshToken: jest.fn(),
    signOut: jest.fn(),
  };

  const testCredentials = {
    id: 'USER_ID',
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should login user and return user id and tokens', async () => {
    const { id: userId, ...tokens } = testCredentials;

    mockAuthService.login.mockResolvedValue(tokens);

    const credentials = await controller.login(userId);

    expect(authService.login).toHaveBeenCalledWith(userId);
    expect(credentials).toEqual({
      id: userId,
      ...tokens,
    });
  });

  it('should register user and return user id and tokens', async () => {
    const dto: SignUpDto = {
      name: 'Carlos Miguel',
      email: 'carlos@test.com',
      password: '12345',
    };

    mockAuthService.signUp.mockResolvedValue(testCredentials);

    const credentials = await controller.signUp(dto);

    expect(authService.signUp).toHaveBeenCalledWith(dto);
    expect(credentials).toEqual(testCredentials);
  });

  it('should refresh user tokens', async () => {
    const { id: userId } = testCredentials;
    const newTokens = {
      accessToken: 'NEW_ACCESS_TOKEN',
      refreshToken: 'NEW_REFRESH_TOKEN',
    };

    mockAuthService.refreshToken.mockResolvedValue(newTokens);

    const tokens = await controller.refreshToken(userId);

    expect(authService.refreshToken).toHaveBeenCalledWith(userId);
    expect(tokens).toEqual(newTokens);
  });

  it('should sign out user', async () => {
    const { id: userId } = testCredentials;
    const result = await controller.signOut(userId);

    expect(authService.signOut).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      message: 'Sign out made successfully!',
    });
  });

  it('should redirect user to frontend url after login with google', async () => {
    const { id: userId, ...tokens } = testCredentials;
    const redirectUrl = `${envs.frontendUrl}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    const mockResponse = { redirect: jest.fn() } as unknown as Response;
    mockAuthService.login.mockResolvedValue(tokens);

    await controller.googleCallback(userId, mockResponse);

    expect(mockResponse.redirect).toHaveBeenCalledWith(redirectUrl);
  });
});
