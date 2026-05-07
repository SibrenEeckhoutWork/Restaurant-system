import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../strategies/jwt-access.strategy.js';
import { UsersService } from '../../users/users.service.js';
import { ModuleConfigService } from '../../module-config/module-config.service.js';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly moduleConfigService: ModuleConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string>('permission', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) return true;

    const isRequired = await this.moduleConfigService.isRequired(required);
    if (!isRequired) return true;

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const dbUser = await this.usersService.findById(user.sub);

    if (!dbUser?.permissions.includes(required)) throw new ForbiddenException();
    return true;
  }
}
