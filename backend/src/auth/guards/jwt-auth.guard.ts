import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../strategies/jwt-access.strategy.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T extends JwtPayload>(err: Error | null, user: T | false): T {
    if (err || !user) throw err ?? new ForbiddenException();
    if (user.type !== 'user') throw new ForbiddenException();
    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
