import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, LocalAuthGuard, RefreshJwtAuthGuard } from './guards';
import { SkipJwtGuard, User } from '@/common/decorators';
import { envs } from '@/config/envs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipJwtGuard()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User('id') userId: string) {
    const { accessToken, refreshToken } = await this.authService.login(userId);

    return { id: userId, accessToken, refreshToken };
  }

  @SkipJwtGuard()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @SkipJwtGuard()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  refreshToken(@User('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(@User('id') userId: string) {
    await this.authService.signOut(userId);

    return { message: 'Sign out realizado com sucesso!' };
  }

  @SkipJwtGuard()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleLogin() {}

  @SkipJwtGuard()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@User('id') userId: string, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(userId);
    const redirectUrl = `${envs.frontendUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`;

    res.redirect(redirectUrl);
  }
}
