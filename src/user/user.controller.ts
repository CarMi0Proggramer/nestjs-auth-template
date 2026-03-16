import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/common/decorators';
import { ApiGetProfile } from './swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetProfile()
  @Get('profile')
  getProfile(@User('id') userId: string) {
    return this.userService.getProfile(userId);
  }
}
