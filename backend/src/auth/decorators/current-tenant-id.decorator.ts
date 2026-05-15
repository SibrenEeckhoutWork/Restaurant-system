import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenantId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const user = ctx.switchToHttp().getRequest<{ user: { tenantId: string } }>().user;
    return user.tenantId;
  },
);
