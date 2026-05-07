import { JwtCustomerPayload } from '../strategies/jwt-customer.strategy.js';
declare const JwtCustomerGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtCustomerGuard extends JwtCustomerGuard_base {
    handleRequest<T extends JwtCustomerPayload>(err: Error | null, user: T | false): T;
}
export {};
