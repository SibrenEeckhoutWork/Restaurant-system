import { Repository } from 'typeorm';
import { Room } from './room.entity.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
export declare class RoomsService {
    private readonly repo;
    constructor(repo: Repository<Room>);
    findAll(): Promise<Room[]>;
    findById(id: string): Promise<Room>;
    create(dto: CreateRoomDto): Promise<Room>;
    update(id: string, dto: UpdateRoomDto): Promise<Room>;
    remove(id: string): Promise<void>;
}
