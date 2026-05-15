import { Repository } from 'typeorm';
import { Room } from './room.entity.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
export declare class RoomsService {
    private readonly repo;
    constructor(repo: Repository<Room>);
    findAll(tenantId: string): Promise<Room[]>;
    findById(id: string, tenantId: string): Promise<Room>;
    create(dto: CreateRoomDto, tenantId: string): Promise<Room>;
    update(id: string, dto: UpdateRoomDto, tenantId: string): Promise<Room>;
    remove(id: string, tenantId: string): Promise<void>;
    bulkRemove(ids: string[], tenantId: string): Promise<void>;
}
