import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/entities/User';
import { AuthProvider } from '@/common/enums/auth-provider.enum';
import { CreateUserParams } from './types/create-user-params';

describe('UserService', () => {
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create and return a new user', async () => {
    const params: CreateUserParams = {
      name: 'Carlos Miguel',
      email: 'carlos@test.com',
      password: '12345',
      authProvider: AuthProvider.LOCAL,
    };
    const user = { id: 'USER_ID', ...params };

    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    const result = await service.create(params);

    expect(result).toEqual(user);
  });

  it('should return user by id', async () => {
    const user = { id: 'USER_ID' };
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await service.findOne(user.id);

    expect(result).toEqual(user);
  });

  it('should return user by email', async () => {
    const user = { id: 'USER_ID', email: 'carlos@test.com' };
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await service.findOneByEmail('carlos@test.com');

    expect(result).toEqual(user);
  });

  it('should update hashed refresh token', async () => {
    mockUserRepository.update.mockResolvedValue({ affected: 1 });

    await service.updateHashedRefreshToken('USER_ID', 'HASHED_TOKEN');

    expect(mockUserRepository.update).toHaveBeenCalledWith('USER_ID', {
      hashedRefreshToken: 'HASHED_TOKEN',
    });
  });

  it('should set hashed refresh token to null', async () => {
    mockUserRepository.update.mockResolvedValue({ affected: 1 });

    await service.updateHashedRefreshToken('USER_ID', null);

    expect(mockUserRepository.update).toHaveBeenCalledWith('USER_ID', {
      hashedRefreshToken: null,
    });
  });

  it('should return email and name when getProfile receives a valid id', async () => {
    const user = { email: 'carlos@test.com', name: 'Carlos Miguel' };
    mockUserRepository.findOne.mockResolvedValue(user);

    const result = await service.getProfile('USER_ID');

    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when getProfile receives an unregistered id', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(service.getProfile('UNKNOWN_ID')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });
});
