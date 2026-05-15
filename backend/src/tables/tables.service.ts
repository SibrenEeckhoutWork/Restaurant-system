import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Table } from './table.entity.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';

@Injectable()
export class TablesService {
  constructor(@InjectRepository(Table) private readonly repo: Repository<Table>) {}

  findAll(tenantId: string, roomId?: string): Promise<Table[]> {
    return this.repo.find({
      where: roomId ? { tenantId, roomId } : { tenantId },
      relations: ['room'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Table> {
    const table = await this.repo.findOne({ where: { id, tenantId }, relations: ['room'] });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  create(dto: CreateTableDto, tenantId: string): Promise<Table> {
    return this.repo.save(this.repo.create({ ...dto, tenantId }));
  }

  async update(id: string, dto: UpdateTableDto, tenantId: string): Promise<Table> {
    const table = await this.findById(id, tenantId);
    Object.assign(table, dto);
    return this.repo.save(table);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const table = await this.findById(id, tenantId);
    await this.repo.remove(table);
  }

  async bulkRemove(ids: string[], tenantId: string): Promise<void> {
    await this.repo.delete({ id: In(ids), tenantId });
  }
}
