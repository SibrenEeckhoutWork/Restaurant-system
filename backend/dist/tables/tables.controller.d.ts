import { TablesService } from './tables.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    findAll(roomId?: string): Promise<import("./table.entity.js").Table[]>;
    findOne(id: string): Promise<import("./table.entity.js").Table>;
    create(dto: CreateTableDto): Promise<import("./table.entity.js").Table>;
    update(id: string, dto: UpdateTableDto): Promise<import("./table.entity.js").Table>;
    remove(id: string): Promise<void>;
}
