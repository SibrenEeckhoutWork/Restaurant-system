import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface SuperAdminPayload {
  sub: string;
  email: string;
  type: 'super_admin';
}

@Injectable()
export class SuperAdminStrategy extends PassportStrategy(Strategy, 'jwt-super-admin') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('SUPER_ADMIN_JWT_SECRET'),
    });
  }

  validate(payload: SuperAdminPayload): SuperAdminPayload {
    if (payload.type !== 'super_admin') throw new UnauthorizedException();
    return payload;
  }
}
