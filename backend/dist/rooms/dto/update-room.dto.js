"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_room_dto_js_1 = require("./create-room.dto.js");
class UpdateRoomDto extends (0, swagger_1.PartialType)(create_room_dto_js_1.CreateRoomDto) {
}
exports.UpdateRoomDto = UpdateRoomDto;
//# sourceMappingURL=update-room.dto.js.map