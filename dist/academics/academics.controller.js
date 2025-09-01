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
const create_department_dto_1 = require("./dto/create-department.dto");
const create_program_dto_1 = require("./dto/create-program.dto");
const create_course_dto_1 = require("./dto/create-course.dto");
const create_cohort_dto_1 = require("./dto/create-cohort.dto");
const create_assignment_dto_1 = require("./dto/create-assignment.dto");
const create_exam_dto_1 = require("./dto/create-exam.dto");
const create_mark_dto_1 = require("./dto/create-mark.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let AcademicsController = class AcademicsController {
    constructor(academicsService) {
        this.academicsService = academicsService;
    }
    createDepartment(dto) {
        return this.academicsService.createDepartment(dto);
    }
    getDepartments() {
        return this.academicsService.getDepartments();
    }
    createProgram(dto) {
        return this.academicsService.createProgram(dto);
    }
    getPrograms(departmentId) {
        return this.academicsService.getPrograms({ departmentId });
    }
    getProgramsByDepartment(id) {
        return this.academicsService.getPrograms({ departmentId: id });
    }
    getCoursesByProgram(id) {
        return this.academicsService.getCourses({ programId: id });
    }
    getCohortsByProgram(id) {
        return this.academicsService.getCohorts({ programId: id });
    }
    createCourse(dto) {
        return this.academicsService.createCourse(dto);
    }
    getCourses(programId) {
        return this.academicsService.getCourses({ programId });
    }
    createCohort(dto) {
        return this.academicsService.createCohort(dto);
    }
    enrollStudent(data) {
        return this.academicsService.enrollStudent(data);
    }
    createAssignment(dto) {
        return this.academicsService.createAssignment(dto);
    }
    submitAssignment(data) {
        return this.academicsService.submitAssignment(data);
    }
    createExam(dto) {
        return this.academicsService.createExam(dto);
    }
    recordExamResult(dto) {
        return this.academicsService.recordExamResult(dto);
    }
    recordAttendance(data) {
        return this.academicsService.recordAttendance(data);
    }
};
exports.AcademicsController = AcademicsController;
__decorate([
    (0, common_1.Post)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create department' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_department_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)('programs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_program_dto_1.CreateProgramDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createProgram", null);
__decorate([
    (0, common_1.Get)('programs'),
    (0, swagger_1.ApiQuery)({ name: 'departmentId', required: false }),
    __param(0, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getPrograms", null);
__decorate([
    (0, common_1.Get)('departments/:id/programs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get programs for a specific department' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getProgramsByDepartment", null);
__decorate([
    (0, common_1.Get)('programs/:id/courses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses for a specific program' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCoursesByProgram", null);
__decorate([
    (0, common_1.Get)('programs/:id/cohorts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cohorts for a specific program' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCohortsByProgram", null);
__decorate([
    (0, common_1.Post)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiQuery)({ name: 'programId', required: false }),
    __param(0, (0, common_1.Query)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Post)('cohorts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cohort_dto_1.CreateCohortDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createCohort", null);
__decorate([
    (0, common_1.Post)('enroll'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.FACULTY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "enrollStudent", null);
__decorate([
    (0, common_1.Post)('assignments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.FACULTY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assignment_dto_1.CreateAssignmentDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createAssignment", null);
__decorate([
    (0, common_1.Post)('assignments/submit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.STUDENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "submitAssignment", null);
__decorate([
    (0, common_1.Post)('exams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.FACULTY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createExam", null);
__decorate([
    (0, common_1.Post)('exams/record'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.FACULTY),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mark_dto_1.CreateMarkDto]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "recordExamResult", null);
__decorate([
    (0, common_1.Post)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.FACULTY, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "recordAttendance", null);
exports.AcademicsController = AcademicsController = __decorate([
    (0, swagger_1.ApiTags)('academics'),
    (0, common_1.Controller)('academics'),
    __metadata("design:paramtypes", [academics_service_1.AcademicsService])
], AcademicsController);
//# sourceMappingURL=academics.controller.js.map