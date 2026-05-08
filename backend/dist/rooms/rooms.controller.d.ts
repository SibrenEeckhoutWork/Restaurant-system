import { RoomsService } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(): Promise<import("./room.entity.js").Room[]>;
    findOne(id: string): Promise<import("./room.entity.js").Room>;
    create(dto: CreateRoomDto): Promise<import("./room.entity.js").Room>;
    update(id: string, dto: UpdateRoomDto): Promise<import("./room.entity.js").Room>;
    remove(id: string): Promise<void>;
}
