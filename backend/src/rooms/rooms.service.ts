import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly repo: Repository<Room>) {}

  findAll(): Promise<Room[]> {
    return this.repo.find({ relations: ['tables'], order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Room> {
    const room = await this.repo.findOne({ where: { id }, relations: ['tables'] });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  create(dto: CreateRoomDto): Promise<Room> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findById(id);
    Object.assign(room, dto);
    return this.repo.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findById(id);
    await this.repo.remove(room);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    await this.repo.delete(ids);
  }
}
