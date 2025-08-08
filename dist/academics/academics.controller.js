"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const academics_service_1 = require("./academics.service");
let AcademicsController = class AcademicsController {
    constructor(academicsService) {
        this.academicsService = academicsService;
    }
    getPrograms() {
        return this.academicsService.getPrograms();
    }
    getDepartments() {
        return this.academicsService.getDepartments();
    }
    getCourses(program) {
        return this.academicsService.getCourses(program);
    }
    getCalendar() {
        return this.academicsService.getAcademicCalendar();
    }
};
exports.AcademicsController = AcademicsController;
__decorate([
    (0, common_1.Get)('programs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all academic programs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getPrograms", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses' }),
    (0, swagger_1.ApiQuery)({ name: 'program', required: false, type: String }),
    __param(0, (0, common_1.Query)('program')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Get)('calendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Get academic calendar' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCalendar", null);
exports.AcademicsController = AcademicsController = __decorate([
    (0, swagger_1.ApiTags)('academics'),
    (0, common_1.Controller)('academics'),
    __metadata("design:paramtypes", [academics_service_1.AcademicsService])
], AcademicsController);
//# sourceMappingURL=academics.controller.js.map