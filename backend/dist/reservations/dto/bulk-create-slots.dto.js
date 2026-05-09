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
exports.BulkCreateSlotsDto = exports.RecurrenceType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var RecurrenceType;
(function (RecurrenceType) {
    RecurrenceType["ONCE"] = "once";
    RecurrenceType["DAILY"] = "daily";
    RecurrenceType["WEEKLY"] = "weekly";
    RecurrenceType["MONTHLY"] = "monthly";
})(RecurrenceType || (exports.RecurrenceType = RecurrenceType = {}));
class BulkCreateSlotsDto {
    startTime;
    endTime;
    roomIds;
    recurrence;
    startDate;
    endDate;
    weekDays;
    monthDay;
}
exports.BulkCreateSlotsDto = BulkCreateSlotsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], BulkCreateSlotsDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '14:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], BulkCreateSlotsDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Room IDs — capacity is computed from their tables' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], BulkCreateSlotsDto.prototype, "roomIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: RecurrenceType }),
    (0, class_validator_1.IsEnum)(RecurrenceType),
    __metadata("design:type", String)
], BulkCreateSlotsDto.prototype, "recurrence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-09' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], BulkCreateSlotsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-05-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/),
    __metadata("design:type", String)
], BulkCreateSlotsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [1, 2, 3, 4, 5], description: '0=Sun, 1=Mon, ..., 6=Sat' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], BulkCreateSlotsDto.prototype, "weekDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    __metadata("design:type", Number)
], BulkCreateSlotsDto.prototype, "monthDay", void 0);
//# sourceMappingURL=bulk-create-slots.dto.js.map