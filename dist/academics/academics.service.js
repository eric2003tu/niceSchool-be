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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AcademicsService = class AcademicsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDepartment(data) {
        return this.prisma.department.create({ data });
    }
    async getDepartments() {
        return this.prisma.department.findMany({ include: { programs: true, courses: true, head: true } });
    }
    async getDepartment(id) {
        const dep = await this.prisma.department.findUnique({ where: { id }, include: { programs: true, courses: true, head: true } });
        if (!dep)
            throw new common_1.NotFoundException('Department not found');
        return dep;
    }
    async createProgram(data) {
        return this.prisma.program.create({ data });
    }
    async getPrograms() {
        return this.prisma.program.findMany({ include: { courses: true, cohorts: true } });
    }
    async createCourse(data) {
        return this.prisma.course.create({ data });
    }
    async getCourses(filter) {
        const where = (filter === null || filter === void 0 ? void 0 : filter.programId) ? { programId: filter.programId } : undefined;
        return this.prisma.course.findMany({ where, include: { instructors: true, assignments: true, exams: true } });
    }
    async createCohort(data) {
        return this.prisma.cohort.create({ data });
    }
    async enrollStudent(data) {
        return this.prisma.enrollment.create({ data });
    }
    async createAssignment(data) {
        return this.prisma.assignment.create({ data });
    }
    async submitAssignment(data) {
        return this.prisma.assignmentSubmission.create({ data });
    }
    async createExam(data) {
        return this.prisma.exam.create({ data });
    }
    async recordExamResult(data) {
        return this.prisma.examResult.create({ data });
    }
    async recordAttendance(data) {
        return this.prisma.attendance.create({ data });
    }
};
exports.AcademicsService = AcademicsService;
exports.AcademicsService = AcademicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicsService);
//# sourceMappingURL=academics.service.js.map