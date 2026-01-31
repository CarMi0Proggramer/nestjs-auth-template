import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Req() req: Request) {
    const user: any = req.user;
    return this.userService.getProfile(user.id);
  }
}
