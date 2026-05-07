import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtCustomerPayload {
  sub: string;
  email: string;
  type: 'customer';
}

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(Strategy, 'jwt-customer') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_CUSTOMER_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtCustomerPayload): JwtCustomerPayload {
    if (payload.type !== 'customer') throw new UnauthorizedException();
    return payload;
  }
}
