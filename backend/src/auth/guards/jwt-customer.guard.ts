import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtCustomerPayload } from '../strategies/jwt-customer.strategy.js';

@Injectable()
export class JwtCustomerGuard extends AuthGuard('jwt-customer') {
  handleRequest<T extends JwtCustomerPayload>(err: Error | null, user: T | false): T {
    if (err || !user) throw err ?? new ForbiddenException();
    if (user.type !== 'customer') throw new ForbiddenException();
    return user;
  }
}
