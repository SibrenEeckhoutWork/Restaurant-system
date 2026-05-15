export declare class User {
    id: string;
    tenantId: string | null;
    isSuperAdmin: boolean;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    refreshTokenHash: string | null;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}
