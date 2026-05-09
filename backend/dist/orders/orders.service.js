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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_js_1 = require("./order.entity.js");
const order_item_entity_js_1 = require("./order-item.entity.js");
const order_item_accessory_entity_js_1 = require("./order-item-accessory.entity.js");
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    itemAccRepo;
    constructor(orderRepo, itemRepo, itemAccRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.itemAccRepo = itemAccRepo;
    }
    findAll() {
        return this.orderRepo.find({
            relations: { table: true, items: { product: { accessories: true }, accessories: { accessory: true } } },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: { table: true, items: { product: { accessories: true }, accessories: { accessory: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async create(dto) {
        const order = await this.orderRepo.save(this.orderRepo.create({ tableId: dto.tableId }));
        await this.saveItems(order.id, dto.items);
        return this.findById(order.id);
    }
    async updateStatus(id, dto) {
        const order = await this.findById(id);
        order.status = dto.status;
        await this.orderRepo.save(order);
        return this.findById(id);
    }
    async updateItems(id, dto) {
        await this.findById(id);
        const existing = await this.itemRepo.find({ where: { orderId: id } });
        await this.itemRepo.remove(existing);
        await this.saveItems(id, dto.items);
        return this.findById(id);
    }
    async remove(id) {
        const order = await this.findById(id);
        await this.orderRepo.remove(order);
    }
    async bulkRemove(ids) {
        await this.orderRepo.delete({ id: (0, typeorm_2.In)(ids) });
    }
    async saveItems(orderId, itemDtos) {
        for (const dto of itemDtos) {
            const item = await this.itemRepo.save(this.itemRepo.create({
                orderId,
                productId: dto.productId,
                quantity: dto.quantity,
                notes: dto.notes ?? null,
            }));
            if (dto.accessories?.length) {
                await this.itemAccRepo.save(dto.accessories.map((a) => this.itemAccRepo.create({
                    orderItemId: item.id,
                    accessoryId: a.accessoryId,
                    quantity: a.quantity,
                })));
            }
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_js_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_js_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_item_accessory_entity_js_1.OrderItemAccessory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map