import { Repository } from 'typeorm';
import { Table } from './table.entity.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
export declare class TablesService {
    private readonly repo;
    constructor(repo: Repository<Table>);
    findAll(tenantId: string, roomId?: string): Promise<Table[]>;
    findById(id: string, tenantId: string): Promise<Table>;
    create(dto: CreateTableDto, tenantId: string): Promise<Table>;
    update(id: string, dto: UpdateTableDto, tenantId: string): Promise<Table>;
    remove(id: string, tenantId: string): Promise<void>;
    bulkRemove(ids: string[], tenantId: string): Promise<void>;
}
