import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage) private readonly repo: Repository<ContactMessage>,
  ) {}

  create(dto: CreateContactMessageDto, tenantId: string): Promise<ContactMessage> {
    const { tenantSlug: _slug, ...fields } = dto;
    return this.repo.save(this.repo.create({ ...fields, tenantId }));
  }

  findAll(tenantId: string): Promise<ContactMessage[]> {
    return this.repo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async markRead(id: string): Promise<ContactMessage> {
    const msg = await this.repo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    msg.isRead = true;
    return this.repo.save(msg);
  }

  async remove(id: string): Promise<void> {
    const msg = await this.repo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    await this.repo.remove(msg);
  }

  async bulkRemove(ids: string[]): Promise<void> {
    const msgs = await this.repo.find({ where: { id: In(ids) } });
    await this.repo.remove(msgs);
  }
}
