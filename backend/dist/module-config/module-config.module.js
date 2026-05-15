"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleConfigModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const module_config_entity_js_1 = require("./module-config.entity.js");
const module_config_service_js_1 = require("./module-config.service.js");
const module_config_controller_js_1 = require("./module-config.controller.js");
const users_module_js_1 = require("../users/users.module.js");
let ModuleConfigModule = class ModuleConfigModule {
};
exports.ModuleConfigModule = ModuleConfigModule;
exports.ModuleConfigModule = ModuleConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([module_config_entity_js_1.ModuleConfig]), (0, common_1.forwardRef)(() => users_module_js_1.UsersModule)],
        providers: [module_config_service_js_1.ModuleConfigService],
        controllers: [module_config_controller_js_1.ModuleConfigController],
        exports: [module_config_service_js_1.ModuleConfigService],
    })
], ModuleConfigModule);
//# sourceMappingURL=module-config.module.js.map