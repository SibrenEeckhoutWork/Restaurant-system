"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_js_1 = require("./customer.entity.js");
const customers_service_js_1 = require("./customers.service.js");
const customers_controller_js_1 = require("./customers.controller.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
const users_module_js_1 = require("../users/users.module.js");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_entity_js_1.Customer]), module_config_module_js_1.ModuleConfigModule, users_module_js_1.UsersModule],
        providers: [customers_service_js_1.CustomersService],
        controllers: [customers_controller_js_1.CustomersController],
        exports: [customers_service_js_1.CustomersService],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map