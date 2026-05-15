import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(tenantId: string): Promise<import("./user.entity.js").User[]>;
    findOne(id: string): Promise<import("./user.entity.js").User | null>;
    create(dto: CreateUserDto, tenantId: string): Promise<import("./user.entity.js").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("./user.entity.js").User>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
