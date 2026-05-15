"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentTenantId = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentTenantId = (0, common_1.createParamDecorator)((_, ctx) => {
    const user = ctx.switchToHttp().getRequest().user;
    return user.tenantId;
});
//# sourceMappingURL=current-tenant-id.decorator.js.map