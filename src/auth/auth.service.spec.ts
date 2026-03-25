import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthProvider } from '../common/enums/auth-provider.enum';
import { SignUpDto } from './dto/signup.dto';
import { GoogleProfile } from './types/google-profile';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  const mockUserService = {
    create: jest.fn(),
    updateHashedRefreshToken: jest.fn(),
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
  };
  const mockJwtService = { signAsync: jest.fn() };

  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should sign up user and return their credentials', async () => {
    const dto: SignUpDto = {
      name: 'Carlos Miguel',
      email: 'carlos@test.com',
      password: '12345',
    };
    const user = { id: 'USER_ID' };

    mockUserService.create.mockResolvedValue(user);
    mockJwtService.signAsync
      .mockResolvedValueOnce('ACCESS_TOKEN')
      .mockResolvedValueOnce('REFRESH_TOKEN');
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_REFRESH_TOKEN');

    const result = await service.signUp(dto);

    expect(userService.create).toHaveBeenCalledWith({
      ...dto,
      authProvider: AuthProvider.LOCAL,
    });
    expect(userService.updateHashedRefreshToken).toHaveBeenCalledWith(
      user.id,
      'HASHED_REFRESH_TOKEN',
    );

    expect(result).toEqual({
      id: user.id,
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });
  });

  it('should throw an error if user email exists when signing up', async () => {
    const dto: SignUpDto = {
      name: 'Carlos Miguel',
      email: 'carlos@test.com',
      password: '12345',
    };

    mockUserService.create.mockRejectedValue({ code: '23505' });

    await expect(service.signUp(dto)).rejects.toThrow(
      new UnauthorizedException('Já existe um usuário com este e-mail.'),
    );

    mockUserService.create.mockReset();
  });

  it('should throw an internal server error if an unknown error happens', async () => {
    const dto: SignUpDto = {
      name: 'Carlos Miguel',
      email: 'carlos@test.com',
      password: '12345',
    };

    mockUserService.create.mockRejectedValue({});

    await expect(service.signUp(dto)).rejects.toThrow(
      new InternalServerErrorException('Error do servidor'),
    );

    mockUserService.create.mockReset();
  });

  it('should login user, return their tokens and update their hashed refresh token', async () => {
    const userId = 'USER_ID';

    mockJwtService.signAsync
      .mockResolvedValueOnce('ACCESS_TOKEN')
      .mockResolvedValueOnce('REFRESH_TOKEN');
    (argon2.hash as jest.Mock).mockResolvedValue('HASHED_REFRESH_TOKEN');

    const tokens = await service.login(userId);

    expect(mockUserService.updateHashedRefreshToken).toHaveBeenCalledWith(
      userId,
      'HASHED_REFRESH_TOKEN',
    );

    expect(tokens).toEqual({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });
  });

  it('should sign out user and set their hashed refresh token to null', async () => {
    const userId = 'USER_ID';

    await service.signOut(userId);

    expect(mockUserService.updateHashedRefreshToken).toHaveBeenCalledWith(
      userId,
      null,
    );
  });

  it('should return user id when validateUser receives valid credentials', async () => {
    const userId = 'USER_ID';
    const email = 'carlos@test.com';
    const password = '12345';

    mockUserService.findOneByEmail.mockResolvedValue({
      id: userId,
      email,
      password,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser(email, password);

    expect(result).toEqual({ id: userId });
  });

  it('should throw NotFoundException when validateUser receives unregistered email', async () => {
    const email = 'carlos@test.com';
    const password = '12345';

    mockUserService.findOneByEmail.mockResolvedValue(null);

    await expect(service.validateUser(email, password)).rejects.toThrow(
      new NotFoundException('Usuário não encontrado'),
    );
  });

  it('should throw ConflictException when validateUser detects an OAuth account', async () => {
    const email = 'carlos@test.com';
    const password = '12345';

    mockUserService.findOneByEmail.mockResolvedValue({ id: 'USER_ID' });

    await expect(service.validateUser(email, password)).rejects.toThrow(
      new ConflictException('Este e-mail já está cadastrado com Google.'),
    );
  });

  it('should throw BadRequestException when validateUser receives wrong password', async () => {
    const email = 'carlos@test.com';
    const password = '12345';

    mockUserService.findOneByEmail.mockResolvedValue({
      id: 'USER_ID',
      email,
      password,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.validateUser(email, password)).rejects.toThrow(
      new BadRequestException('Credenciais inválidas'),
    );
  });

  it('should return user id when validateRefreshToken receives valid token', async () => {
    const userId = 'USER_ID';
    const refreshToken = 'REFRESH_TOKEN';

    mockUserService.findOne.mockResolvedValue({
      hashedRefreshToken: 'HASHED_REFRESH_TOKEN',
    });

    (argon2.verify as jest.Mock).mockResolvedValue(true);

    const result = await service.validateRefreshToken(userId, refreshToken);

    expect(result).toEqual({ id: userId });
  });

  it('should throw UnauthorizedException when validateRefreshToken finds no user', async () => {
    const userId = 'USER_ID';
    const refreshToken = 'REFRESH_TOKEN';

    mockUserService.findOne.mockResolvedValue(null);

    await expect(
      service.validateRefreshToken(userId, refreshToken),
    ).rejects.toThrow(new UnauthorizedException('Refresh token inválido'));
  });

  it('should throw UnauthorizedException when validateRefreshToken finds user without hashed refresh token', async () => {
    const userId = 'USER_ID';
    const refreshToken = 'REFRESH_TOKEN';

    mockUserService.findOne.mockResolvedValue({});

    await expect(
      service.validateRefreshToken(userId, refreshToken),
    ).rejects.toThrow(new UnauthorizedException('Refresh token inválido'));
  });

  it('should throw UnauthorizedException when validateRefreshToken receives mismatched token', async () => {
    const userId = 'USER_ID';
    const refreshToken = 'REFRESH_TOKEN';

    mockUserService.findOne.mockResolvedValue({
      hashedRefreshToken: 'HASHED_REFRESH_TOKEN',
    });

    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateRefreshToken(userId, refreshToken),
    ).rejects.toThrow(new UnauthorizedException('Refresh token inválido'));
  });

  it('should store google user if not exists', async () => {
    const user = {
      name: 'Google User',
      email: 'google@gmail.com',
      authProvider: AuthProvider.GOOGLE,
    };

    const profile: GoogleProfile = {
      displayName: user.name,
      emails: [{ value: user.email, verified: true }],
    };

    mockUserService.findOneByEmail.mockResolvedValue(null);
    await service.validateGoogleUser(profile);

    expect(mockUserService.create).toHaveBeenCalledWith(user);
  });

  it('should return google user if exists', async () => {
    const user = {
      id: 'USER_ID',
      name: 'Google User',
      email: 'google@gmail.com',
      authProvider: AuthProvider.GOOGLE,
    };

    const profile: GoogleProfile = {
      displayName: user.name,
      emails: [{ value: user.email, verified: true }],
    };

    mockUserService.findOneByEmail.mockResolvedValue(user);

    const result = await service.validateGoogleUser(profile);
    expect(result).toEqual(user);
  });
});
