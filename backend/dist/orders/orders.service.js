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
const customers_service_js_1 = require("../customers/customers.service.js");
let OrdersService = class OrdersService {
    orderRepo;
    itemRepo;
    itemAccRepo;
    customersService;
    constructor(orderRepo, itemRepo, itemAccRepo, customersService) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.itemAccRepo = itemAccRepo;
        this.customersService = customersService;
    }
    findAll(tenantId) {
        return this.orderRepo.find({
            where: { tenantId },
            relations: { table: true, items: { product: { accessories: true, category: true }, accessories: { accessory: true } } },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id, tenantId) {
        const order = await this.orderRepo.findOne({
            where: { id, tenantId },
            relations: { table: true, items: { product: { accessories: true, category: true }, accessories: { accessory: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async create(dto, tenantId) {
        let customerId = null;
        if (dto.email) {
            const customer = await this.customersService.findByEmailInTenant(dto.email, tenantId);
            customerId = customer?.id ?? null;
        }
        const order = await this.orderRepo.save(this.orderRepo.create({
            tableId: dto.tableId ?? null,
            customerName: dto.customerName ?? null,
            email: dto.email ?? null,
            phone: dto.phone ?? null,
            address: dto.address ?? null,
            deliveryType: dto.deliveryType ?? null,
            customerId,
            tenantId,
        }));
        await this.saveItems(order.id, dto.items);
        return this.findById(order.id, tenantId);
    }
    async updateStatus(id, dto, tenantId) {
        const order = await this.findById(id, tenantId);
        order.status = dto.status;
        await this.orderRepo.save(order);
        const syncStatuses = {
            [order_entity_js_1.OrderStatus.PENDING]: 'pending',
            [order_entity_js_1.OrderStatus.PREPARING]: 'preparing',
            [order_entity_js_1.OrderStatus.READY]: 'ready',
            [order_entity_js_1.OrderStatus.DELIVERED]: 'delivered',
        };
        const itemStatus = syncStatuses[dto.status];
        if (itemStatus) {
            await this.itemRepo.update({ orderId: id }, { itemStatus });
        }
        return this.findById(id, tenantId);
    }
    async updateItems(id, dto, tenantId) {
        await this.findById(id, tenantId);
        const existing = await this.itemRepo.find({ where: { orderId: id } });
        await this.itemRepo.remove(existing);
        await this.saveItems(id, dto.items);
        return this.findById(id, tenantId);
    }
    async remove(id, tenantId) {
        const order = await this.findById(id, tenantId);
        await this.orderRepo.remove(order);
    }
    async bulkRemove(ids, tenantId) {
        await this.orderRepo.delete({ id: (0, typeorm_2.In)(ids), tenantId });
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
    async updateItemStatus(orderId, itemId, status, tenantId) {
        await this.itemRepo.update({ id: itemId, orderId }, { itemStatus: status });
        const order = await this.findById(orderId, tenantId);
        const statuses = order.items.map((i) => i.itemStatus);
        let next = order.status;
        if (statuses.every((s) => s === 'delivered') && order.status !== order_entity_js_1.OrderStatus.DELIVERED) {
            next = order_entity_js_1.OrderStatus.DELIVERED;
        }
        else if (statuses.every((s) => s === 'ready' || s === 'delivered') && order.status !== order_entity_js_1.OrderStatus.READY && order.status !== order_entity_js_1.OrderStatus.DELIVERED) {
            next = order_entity_js_1.OrderStatus.READY;
        }
        else if (statuses.some((s) => s !== 'pending') && order.status === order_entity_js_1.OrderStatus.PENDING) {
            next = order_entity_js_1.OrderStatus.PREPARING;
        }
        if (next !== order.status) {
            order.status = next;
            await this.orderRepo.save(order);
        }
        return this.findById(orderId, tenantId);
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
        typeorm_2.Repository,
        customers_service_js_1.CustomersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map