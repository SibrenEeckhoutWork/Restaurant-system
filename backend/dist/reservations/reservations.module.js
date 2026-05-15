"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reservation_slot_entity_js_1 = require("./reservation-slot.entity.js");
const reservation_entity_js_1 = require("./reservation.entity.js");
const reservations_service_js_1 = require("./reservations.service.js");
const reservations_controller_js_1 = require("./reservations.controller.js");
const room_entity_js_1 = require("../rooms/room.entity.js");
const customer_entity_js_1 = require("../customers/customer.entity.js");
const users_module_js_1 = require("../users/users.module.js");
const tenants_module_js_1 = require("../tenants/tenants.module.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reservation_slot_entity_js_1.ReservationSlot, reservation_entity_js_1.Reservation, room_entity_js_1.Room, customer_entity_js_1.Customer]),
            users_module_js_1.UsersModule,
            tenants_module_js_1.TenantsModule,
            module_config_module_js_1.ModuleConfigModule,
        ],
        providers: [reservations_service_js_1.ReservationsService],
        controllers: [reservations_controller_js_1.ReservationsController],
        exports: [reservations_service_js_1.ReservationsService],
    })
], ReservationsModule);
//# sourceMappingURL=reservations.module.js.map