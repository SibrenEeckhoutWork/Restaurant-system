"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_message_entity_js_1 = require("./contact-message.entity.js");
let ContactService = class ContactService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(dto, tenantId) {
        const { tenantSlug: _slug, ...fields } = dto;
        return this.repo.save(this.repo.create({ ...fields, tenantId }));
    }
    findAll(tenantId) {
        return this.repo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
    }
    async markRead(id) {
        const msg = await this.repo.findOne({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        msg.isRead = true;
        return this.repo.save(msg);
    }
    async remove(id) {
        const msg = await this.repo.findOne({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        await this.repo.remove(msg);
    }
    async bulkRemove(ids) {
        const msgs = await this.repo.find({ where: { id: (0, typeorm_2.In)(ids) } });
        await this.repo.remove(msgs);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_message_entity_js_1.ContactMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactService);
//# sourceMappingURL=contact.service.js.map