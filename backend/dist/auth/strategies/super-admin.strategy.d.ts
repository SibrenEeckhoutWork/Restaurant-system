import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
export interface SuperAdminPayload {
    sub: string;
    email: string;
    type: 'super_admin';
}
declare const SuperAdminStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class SuperAdminStrategy extends SuperAdminStrategy_base {
    constructor(config: ConfigService);
    validate(payload: SuperAdminPayload): SuperAdminPayload;
}
export {};
