import { Repository } from 'typeorm';
import { Table } from './table.entity.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
export declare class TablesService {
    private readonly repo;
    constructor(repo: Repository<Table>);
    findAll(roomId?: string): Promise<Table[]>;
    findById(id: string): Promise<Table>;
    create(dto: CreateTableDto): Promise<Table>;
    update(id: string, dto: UpdateTableDto): Promise<Table>;
    remove(id: string): Promise<void>;
    bulkRemove(ids: string[]): Promise<void>;
}
