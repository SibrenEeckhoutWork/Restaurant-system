import { TablesService } from './tables.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    findAll(tenantId: string, roomId?: string): Promise<import("./table.entity.js").Table[]>;
    findOne(id: string, tenantId: string): Promise<import("./table.entity.js").Table>;
    create(dto: CreateTableDto, tenantId: string): Promise<import("./table.entity.js").Table>;
    update(id: string, dto: UpdateTableDto, tenantId: string): Promise<import("./table.entity.js").Table>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
