import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@User('sub') userId: string) {
    return this.userService.getProfile(userId);
  }
}
