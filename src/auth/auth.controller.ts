import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshJwtAuthGuard } from './guards';
import { SkipJwtGuard, User } from '@/common/decorators';

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
}
