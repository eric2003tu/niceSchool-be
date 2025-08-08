"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFacultyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_faculty_dto_1 = require("./create-faculty.dto");
class UpdateFacultyDto extends (0, swagger_1.PartialType)(create_faculty_dto_1.CreateFacultyDto) {
}
exports.UpdateFacultyDto = UpdateFacultyDto;
//# sourceMappingURL=update-faculty.dto.js.map