import { Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
export declare class ContactService {
    private readonly repo;
    constructor(repo: Repository<ContactMessage>);
    create(dto: CreateContactMessageDto, tenantId: string): Promise<ContactMessage>;
    findAll(tenantId: string): Promise<ContactMessage[]>;
    markRead(id: string): Promise<ContactMessage>;
    remove(id: string): Promise<void>;
    bulkRemove(ids: string[]): Promise<void>;
}
