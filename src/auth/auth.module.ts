import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { envs } from '@/config/envs';
import { User } from '@/entities/User';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import {
  LocalStrategy,
  JwtStrategy,
  RefreshJwtStrategy,
  GoogleStrategy,
} from './strategies';
import { JwtAuthGuard } from './guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: envs.jwtExpireIn as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
