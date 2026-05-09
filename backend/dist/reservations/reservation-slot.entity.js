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
exports.ReservationSlot = exports.SlotRecurrence = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_js_1 = require("./reservation.entity.js");
const room_entity_js_1 = require("../rooms/room.entity.js");
var SlotRecurrence;
(function (SlotRecurrence) {
    SlotRecurrence["DAILY"] = "daily";
    SlotRecurrence["WEEKLY"] = "weekly";
    SlotRecurrence["MONTHLY"] = "monthly";
})(SlotRecurrence || (exports.SlotRecurrence = SlotRecurrence = {}));
let ReservationSlot = class ReservationSlot {
    id;
    startTime;
    endTime;
    maxCapacity;
    isActive;
    recurrence;
    daysOfWeek;
    monthDay;
    rooms;
    reservations;
};
exports.ReservationSlot = ReservationSlot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReservationSlot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], ReservationSlot.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], ReservationSlot.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], ReservationSlot.prototype, "maxCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ReservationSlot.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SlotRecurrence, default: SlotRecurrence.DAILY }),
    __metadata("design:type", String)
], ReservationSlot.prototype, "recurrence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], ReservationSlot.prototype, "daysOfWeek", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata("design:type", Object)
], ReservationSlot.prototype, "monthDay", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => room_entity_js_1.Room, { eager: false }),
    (0, typeorm_1.JoinTable)({ name: 'reservation_slot_rooms' }),
    __metadata("design:type", Array)
], ReservationSlot.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_js_1.Reservation, (r) => r.slot),
    __metadata("design:type", Array)
], ReservationSlot.prototype, "reservations", void 0);
exports.ReservationSlot = ReservationSlot = __decorate([
    (0, typeorm_1.Entity)('reservation_slots')
], ReservationSlot);
//# sourceMappingURL=reservation-slot.entity.js.map