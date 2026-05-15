import { RoomsService } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(tenantId: string): Promise<import("./room.entity.js").Room[]>;
    findOne(id: string, tenantId: string): Promise<import("./room.entity.js").Room>;
    create(dto: CreateRoomDto, tenantId: string): Promise<import("./room.entity.js").Room>;
    update(id: string, dto: UpdateRoomDto, tenantId: string): Promise<import("./room.entity.js").Room>;
    bulkDelete(body: {
        ids: string[];
    }, tenantId: string): Promise<void>;
    remove(id: string, tenantId: string): Promise<void>;
}
