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
exports.CreateSlotDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const reservation_slot_entity_js_1 = require("../reservation-slot.entity.js");
class CreateSlotDto {
    startTime;
    endTime;
    roomIds;
    isActive;
    recurrence;
    daysOfWeek;
    monthDay;
}
exports.CreateSlotDto = CreateSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Room IDs — capacity computed from their tables' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateSlotDto.prototype, "roomIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSlotDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: reservation_slot_entity_js_1.SlotRecurrence, default: reservation_slot_entity_js_1.SlotRecurrence.DAILY }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(reservation_slot_entity_js_1.SlotRecurrence),
    __metadata("design:type", String)
], CreateSlotDto.prototype, "recurrence", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [Number], description: 'For weekly: days of week (0=Sun…6=Sat)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    __metadata("design:type", Array)
], CreateSlotDto.prototype, "daysOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'For monthly: day of month (1–31)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], CreateSlotDto.prototype, "monthDay", void 0);
//# sourceMappingURL=create-slot.dto.js.map