import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Room } from './room.entity.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly repo: Repository<Room>) {}

  findAll(tenantId: string): Promise<Room[]> {
    return this.repo.find({ where: { tenantId }, relations: ['tables'], order: { name: 'ASC' } });
  }

  async findById(id: string, tenantId: string): Promise<Room> {
    const room = await this.repo.findOne({ where: { id, tenantId }, relations: ['tables'] });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  create(dto: CreateRoomDto, tenantId: string): Promise<Room> {
    return this.repo.save(this.repo.create({ ...dto, tenantId }));
  }

  async update(id: string, dto: UpdateRoomDto, tenantId: string): Promise<Room> {
    const room = await this.findById(id, tenantId);
    Object.assign(room, dto);
    return this.repo.save(room);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const room = await this.findById(id, tenantId);
    await this.repo.remove(room);
  }

  async bulkRemove(ids: string[], tenantId: string): Promise<void> {
    await this.repo.delete({ id: In(ids), tenantId });
  }
}
