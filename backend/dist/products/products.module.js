"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_js_1 = require("./product.entity.js");
const category_entity_js_1 = require("./category.entity.js");
const allergy_entity_js_1 = require("./allergy.entity.js");
const accessory_entity_js_1 = require("./accessory.entity.js");
const products_service_js_1 = require("./products.service.js");
const products_controller_js_1 = require("./products.controller.js");
const users_module_js_1 = require("../users/users.module.js");
const module_config_module_js_1 = require("../module-config/module-config.module.js");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_entity_js_1.Product, category_entity_js_1.Category, allergy_entity_js_1.Allergy, accessory_entity_js_1.Accessory]),
            users_module_js_1.UsersModule,
            module_config_module_js_1.ModuleConfigModule,
        ],
        providers: [products_service_js_1.ProductsService],
        controllers: [products_controller_js_1.ProductsController, products_controller_js_1.CategoriesController, products_controller_js_1.AllergiesController, products_controller_js_1.AccessoriesController],
        exports: [products_service_js_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map