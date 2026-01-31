import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../../config/envs';
import { AuthJwtPayload } from '../types/auth-jwt-payload';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtSecret,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { id: payload.sub };
  }
}
