import { Table } from '../tables/table.entity.js';
export declare class Room {
    id: string;
    tenantId: string;
    name: string;
    capacity: number;
    tables: Table[];
}
