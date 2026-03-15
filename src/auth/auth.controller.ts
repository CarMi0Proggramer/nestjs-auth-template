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
import { Public, User } from '@/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User('id') userId: string) {
    const { accessToken, refreshToken } = await this.authService.login(userId);

    return { id: userId, accessToken, refreshToken };
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  refreshToken(@User('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  @Post('signout')
  async signOut(@User('id') userId: string) {
    await this.authService.signOut(userId);

    return { message: 'Sign out realizado com sucesso!' };
  }
}
