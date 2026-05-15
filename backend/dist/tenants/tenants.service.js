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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_js_1 = require("./tenant.entity.js");
let TenantsService = class TenantsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async findById(id) {
        const t = await this.repo.findOne({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException('Tenant not found');
        return t;
    }
    async findBySlug(slug) {
        return this.repo.findOne({ where: { slug } });
    }
    count() {
        return this.repo.count();
    }
    async create(dto) {
        const existing = await this.repo.findOne({ where: { slug: dto.slug } });
        if (existing)
            throw new common_1.ConflictException('Slug already in use');
        return this.repo.save(this.repo.create({ ...dto, isActive: dto.isActive ?? true }));
    }
    async update(id, dto) {
        const tenant = await this.findById(id);
        if (dto.slug && dto.slug !== tenant.slug) {
            const existing = await this.repo.findOne({ where: { slug: dto.slug } });
            if (existing)
                throw new common_1.ConflictException('Slug already in use');
        }
        Object.assign(tenant, dto);
        return this.repo.save(tenant);
    }
    async remove(id) {
        const tenant = await this.findById(id);
        await this.repo.remove(tenant);
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_js_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map