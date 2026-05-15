import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<User>);
    findAll(tenantId: string): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailInTenant(email: string, tenantId: string): Promise<User | null>;
    findSuperAdminByEmail(email: string): Promise<User | null>;
    count(tenantId?: string): Promise<number>;
    create(data: CreateUserDto | {
        email: string;
        password: string;
        permissions: string[];
        firstName?: string;
        lastName?: string;
        tenantId?: string | null;
        isSuperAdmin?: boolean;
    }): Promise<User>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    bulkRemove(ids: string[]): Promise<void>;
    updateRefreshToken(id: string, hash: string | null): Promise<void>;
}
