"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.use((0, cookie_parser_1.default)());
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002',
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ];
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin))
                cb(null, true);
            else
                cb(new Error(`CORS blocked: ${origin}`));
        },
        credentials: true,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Restaurant API')
        .setDescription('Restaurant Management System API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map