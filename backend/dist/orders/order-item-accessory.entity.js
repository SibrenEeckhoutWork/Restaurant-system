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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemAccessory = void 0;
const typeorm_1 = require("typeorm");
const order_item_entity_js_1 = require("./order-item.entity.js");
const accessory_entity_js_1 = require("../products/accessory.entity.js");
let OrderItemAccessory = class OrderItemAccessory {
    id;
    orderItemId;
    orderItem;
    accessoryId;
    accessory;
    quantity;
};
exports.OrderItemAccessory = OrderItemAccessory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderItemAccessory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItemAccessory.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_entity_js_1.OrderItem, (i) => i.accessories, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'orderItemId' }),
    __metadata("design:type", order_item_entity_js_1.OrderItem)
], OrderItemAccessory.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItemAccessory.prototype, "accessoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => accessory_entity_js_1.Accessory, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'accessoryId' }),
    __metadata("design:type", accessory_entity_js_1.Accessory)
], OrderItemAccessory.prototype, "accessory", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], OrderItemAccessory.prototype, "quantity", void 0);
exports.OrderItemAccessory = OrderItemAccessory = __decorate([
    (0, typeorm_1.Entity)('order_item_accessories')
], OrderItemAccessory);
//# sourceMappingURL=order-item-accessory.entity.js.map