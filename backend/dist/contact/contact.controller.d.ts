import { ContactService } from './contact.service.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
import { TenantsService } from '../tenants/tenants.service.js';
export declare class ContactController {
    private readonly contactService;
    private readonly tenantsService;
    constructor(contactService: ContactService, tenantsService: TenantsService);
    createPublic(dto: CreateContactMessageDto): Promise<import("./contact-message.entity.js").ContactMessage>;
    findAll(tenantId: string): Promise<import("./contact-message.entity.js").ContactMessage[]>;
    markRead(id: string): Promise<import("./contact-message.entity.js").ContactMessage>;
    bulkDelete(body: {
        ids: string[];
    }): Promise<void>;
    remove(id: string): Promise<void>;
}
