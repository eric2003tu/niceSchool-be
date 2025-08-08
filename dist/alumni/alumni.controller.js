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
exports.AlumniController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const alumni_service_1 = require("./alumni.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AlumniController = class AlumniController {
    constructor(alumniService) {
        this.alumniService = alumniService;
    }
    findFeatured() {
        return this.alumniService.findFeatured();
    }
    findEvents() {
        return this.alumniService.findEvents();
    }
    getStats() {
        return this.alumniService.getStats();
    }
    getDirectory(page, limit, search) {
        return this.alumniService.getDirectory(page, limit, search);
    }
};
exports.AlumniController = AlumniController;
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured alumni' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alumni events' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "findEvents", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alumni statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('directory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get alumni directory (Login required)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], AlumniController.prototype, "getDirectory", null);
exports.AlumniController = AlumniController = __decorate([
    (0, swagger_1.ApiTags)('alumni'),
    (0, common_1.Controller)('alumni'),
    __metadata("design:paramtypes", [alumni_service_1.AlumniService])
], AlumniController);
//# sourceMappingURL=alumni.controller.js.map