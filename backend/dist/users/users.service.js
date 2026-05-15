"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_js_1 = require("./user.entity.js");
let UsersService = class UsersService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll(tenantId) {
        return this.repo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    findByEmailInTenant(email, tenantId) {
        return this.repo.findOne({ where: { email, tenantId } });
    }
    findSuperAdminByEmail(email) {
        return this.repo.findOne({ where: { email, isSuperAdmin: true } });
    }
    count(tenantId) {
        return tenantId ? this.repo.count({ where: { tenantId } }) : this.repo.count();
    }
    async create(data) {
        const tenantId = ('tenantId' in data ? data.tenantId : undefined) ?? null;
        const existing = tenantId
            ? await this.findByEmailInTenant(data.email, tenantId)
            : await this.findByEmail(data.email);
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(data.password, 10);
        return this.repo.save(this.repo.create({
            ...data,
            password: hashed,
            firstName: ('firstName' in data && data.firstName) ? data.firstName : '',
            lastName: ('lastName' in data && data.lastName) ? data.lastName : '',
            isActive: ('isActive' in data && data.isActive !== undefined) ? data.isActive : true,
            permissions: data.permissions ?? [],
            tenantId: tenantId,
            isSuperAdmin: ('isSuperAdmin' in data && data.isSuperAdmin) ? data.isSuperAdmin : false,
        }));
    }
    async update(id, dto) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.email && dto.email !== user.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing)
                throw new common_1.ConflictException('Email already in use');
        }
        const updates = { ...dto };
        delete updates.password;
        if (dto.password)
            updates.password = await bcrypt.hash(dto.password, 10);
        Object.assign(user, updates);
        return this.repo.save(user);
    }
    async remove(id) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.repo.remove(user);
    }
    async bulkRemove(ids) {
        const users = await this.repo.find({ where: { id: (0, typeorm_2.In)(ids) } });
        await this.repo.remove(users);
    }
    async updateRefreshToken(id, hash) {
        await this.repo.update(id, { refreshTokenHash: hash });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_js_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map