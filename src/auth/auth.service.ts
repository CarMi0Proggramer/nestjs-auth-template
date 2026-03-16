import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

import { AuthProvider } from '@/common/enums/auth-provider.enum';
import { envs } from '@/config/envs';
import { UserService } from '../user/user.service';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { SignUpDto } from './dto/signup.dto';
import { GoogleProfile } from './types/google-profile';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const userExists = await this.userService.findOneByEmail(signUpDto.email);
    if (userExists) {
      throw new UnauthorizedException('Já existe um usuário com este e-mail.');
    }

    const user = await this.userService.create({
      ...signUpDto,
      authProvider: AuthProvider.LOCAL,
    });

    const { accessToken, refreshToken } = await this.login(user.id);

    return { id: user.id, accessToken, refreshToken };
  }

  login(userId: string) {
    return this.refreshToken(userId);
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }

  private async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId, jti: crypto.randomUUID() };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: envs.refreshJwtSecret,
      expiresIn: envs.refreshJwtExpiresIn,
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  async signOut(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!user.password) {
      throw new ConflictException('Este e-mail já está cadastrado com Google.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      throw new BadRequestException('Credenciais inválidas');

    return { id: user.id };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Refresh token inválido');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Refresh token inválido');

    return { id: userId };
  }

  async validateGoogleUser(googleProfile: GoogleProfile) {
    const email = googleProfile.emails[0].value;
    const user = await this.userService.findOneByEmail(email);

    if (user) return user;

    return await this.userService.create({
      email,
      name: googleProfile.displayName,
      authProvider: AuthProvider.GOOGLE,
    });
  }
}
