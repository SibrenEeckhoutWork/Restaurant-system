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
exports.ModuleConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_config_entity_js_1 = require("./module-config.entity.js");
let ModuleConfigService = class ModuleConfigService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    getAll(tenantId) {
        return this.repo.find({ where: { tenantId } });
    }
    async isRequired(permission, tenantId) {
        const config = await this.repo.findOne({ where: { permission, tenantId } });
        return config === null ? true : config.required;
    }
    async setRequired(permission, required, tenantId) {
        const existing = await this.repo.findOne({ where: { permission, tenantId } });
        if (existing) {
            existing.required = required;
            return this.repo.save(existing);
        }
        return this.repo.save(this.repo.create({ permission, required, tenantId }));
    }
};
exports.ModuleConfigService = ModuleConfigService;
exports.ModuleConfigService = ModuleConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_config_entity_js_1.ModuleConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModuleConfigService);
//# sourceMappingURL=module-config.service.js.map