import { Repository } from 'typeorm';
import { Customer } from './customer.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
export declare class CustomersService {
    private readonly repo;
    constructor(repo: Repository<Customer>);
    findAll(): Promise<Customer[]>;
    findByEmail(email: string): Promise<Customer | null>;
    findById(id: string): Promise<Customer | null>;
    create(data: CreateCustomerDto | {
        name: string;
        email: string;
        password: string;
    }): Promise<Customer>;
    update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<void>;
    bulkRemove(ids: string[]): Promise<void>;
    updateRefreshToken(id: string, hash: string | null): Promise<void>;
}
