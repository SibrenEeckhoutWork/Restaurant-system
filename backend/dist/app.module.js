"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_js_1 = require("./app.controller.js");
const app_service_js_1 = require("./app.service.js");
const users_module_js_1 = require("./users/users.module.js");
const customers_module_js_1 = require("./customers/customers.module.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const webhook_module_js_1 = require("./webhook/webhook.module.js");
const websocket_module_js_1 = require("./websocket/websocket.module.js");
const admin_seed_service_js_1 = require("./seed/admin-seed.service.js");
const module_config_module_js_1 = require("./module-config/module-config.module.js");
const rooms_module_js_1 = require("./rooms/rooms.module.js");
const tables_module_js_1 = require("./tables/tables.module.js");
const reservations_module_js_1 = require("./reservations/reservations.module.js");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: config.get('NODE_ENV') === 'development',
                }),
            }),
            users_module_js_1.UsersModule,
            customers_module_js_1.CustomersModule,
            auth_module_js_1.AuthModule,
            webhook_module_js_1.WebhookModule,
            websocket_module_js_1.WebSocketModule,
            module_config_module_js_1.ModuleConfigModule,
            rooms_module_js_1.RoomsModule,
            tables_module_js_1.TablesModule,
            reservations_module_js_1.ReservationsModule,
        ],
        controllers: [app_controller_js_1.AppController],
        providers: [app_service_js_1.AppService, admin_seed_service_js_1.AdminSeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map