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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_js_1 = require("./room.entity.js");
let RoomsService = class RoomsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll(tenantId) {
        return this.repo.find({ where: { tenantId }, relations: ['tables'], order: { name: 'ASC' } });
    }
    async findById(id, tenantId) {
        const room = await this.repo.findOne({ where: { id, tenantId }, relations: ['tables'] });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    create(dto, tenantId) {
        return this.repo.save(this.repo.create({ ...dto, tenantId }));
    }
    async update(id, dto, tenantId) {
        const room = await this.findById(id, tenantId);
        Object.assign(room, dto);
        return this.repo.save(room);
    }
    async remove(id, tenantId) {
        const room = await this.findById(id, tenantId);
        await this.repo.remove(room);
    }
    async bulkRemove(ids, tenantId) {
        await this.repo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_js_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map