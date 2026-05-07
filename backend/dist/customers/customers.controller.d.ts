import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<import("./customer.entity.js").Customer[]>;
    findOne(id: string): Promise<import("./customer.entity.js").Customer | null>;
    create(dto: CreateCustomerDto): Promise<import("./customer.entity.js").Customer>;
    update(id: string, dto: UpdateCustomerDto): Promise<import("./customer.entity.js").Customer>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
