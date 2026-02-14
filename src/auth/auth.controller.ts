import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshJwtAuthGuard } from './guards';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user: any = req.user!;
    const { accessToken, refreshToken } = await this.authService.login(user.id);

    return { id: user.id, accessToken, refreshToken };
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: Request) {
    const user: any = req.user!;
    return this.authService.refreshToken(user.id);
  }

  @Post('signout')
  async signOut(@Req() req: Request) {
    const user: any = req.user!;
    await this.authService.signOut(user.id);

    return { message: 'Sign out realizado com sucesso!' };
  }
}
