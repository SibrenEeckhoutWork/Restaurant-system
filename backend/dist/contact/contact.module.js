"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contact_message_entity_js_1 = require("./contact-message.entity.js");
const contact_service_js_1 = require("./contact.service.js");
const contact_controller_js_1 = require("./contact.controller.js");
const tenants_module_js_1 = require("../tenants/tenants.module.js");
const users_module_js_1 = require("../users/users.module.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
let ContactModule = class ContactModule {
};
exports.ContactModule = ContactModule;
exports.ContactModule = ContactModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([contact_message_entity_js_1.ContactMessage]), tenants_module_js_1.TenantsModule, users_module_js_1.UsersModule, module_config_module_js_1.ModuleConfigModule],
        providers: [contact_service_js_1.ContactService],
        controllers: [contact_controller_js_1.ContactController],
    })
], ContactModule);
//# sourceMappingURL=contact.module.js.map