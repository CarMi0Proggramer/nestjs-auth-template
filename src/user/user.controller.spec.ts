import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  const mockUserService = { getProfile: jest.fn() };

  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should return user profile', async () => {
    const userId = 'USER_ID';
    const profile = { email: 'carlos@test.com', name: 'Carlos Miguel' };

    mockUserService.getProfile.mockResolvedValue(profile);

    const result = await controller.getProfile(userId);

    expect(result).toEqual(profile);
    expect(userService.getProfile).toHaveBeenCalledWith(userId);
  });
});
