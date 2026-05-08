"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const table_entity_js_1 = require("./table.entity.js");
const tables_service_js_1 = require("./tables.service.js");
const tables_controller_js_1 = require("./tables.controller.js");
const users_module_js_1 = require("../users/users.module.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
let TablesModule = class TablesModule {
};
exports.TablesModule = TablesModule;
exports.TablesModule = TablesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([table_entity_js_1.Table]), users_module_js_1.UsersModule, module_config_module_js_1.ModuleConfigModule],
        providers: [tables_service_js_1.TablesService],
        controllers: [tables_controller_js_1.TablesController],
        exports: [tables_service_js_1.TablesService],
    })
], TablesModule);
//# sourceMappingURL=tables.module.js.map