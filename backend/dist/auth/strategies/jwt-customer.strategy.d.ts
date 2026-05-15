import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
export interface JwtCustomerPayload {
    sub: string;
    email: string;
    type: 'customer';
    tenantId: string;
}
declare const JwtCustomerStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtCustomerStrategy extends JwtCustomerStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtCustomerPayload): JwtCustomerPayload;
}
export {};
