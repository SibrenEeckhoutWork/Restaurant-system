import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../strategies/jwt-access.strategy.js';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    handleRequest<T extends JwtPayload>(err: Error | null, user: T | false): T;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
