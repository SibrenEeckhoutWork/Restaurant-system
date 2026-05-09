import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Table } from './table.entity.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';

@Injectable()
export class TablesService {
  constructor(@InjectRepository(Table) private readonly repo: Repository<Table>) {}

  findAll(roomId?: string): Promise<Table[]> {
    return this.repo.find({
      where: roomId ? { roomId } : undefined,
      relations: ['room'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Table> {
    const table = await this.repo.findOne({ where: { id }, relations: ['room'] });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  create(dto: CreateTableDto): Promise<Table> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateTableDto): Promise<Table> {
    const table = await this.findById(id);
    Object.assign(table, dto);
    return this.repo.save(table);
  }

  async remove(id: string): Promise<void> {
    const table = await this.findById(id);
    await this.repo.remove(table);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    await this.repo.delete({ id: In(ids) });
  }
}
