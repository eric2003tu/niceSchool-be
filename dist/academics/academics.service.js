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
        const payload = {
            name: data.name,
            code: data.code,
            description: data.description,
        };
        if (data.headId) {
            const head = await this.prisma.faculty.findUnique({ where: { id: data.headId } });
            if (!head)
                throw new common_1.BadRequestException('Invalid headId: faculty not found');
            payload.headId = data.headId;
        }
        return this.prisma.department.create({ data: payload });
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
        const payload = {
            name: data.name,
            code: data.code,
            level: data.level,
            departmentId: data.departmentId,
            durationYears: data.durationYears,
            description: data.description,
        };
        return this.prisma.program.create({ data: payload });
    }
    async getPrograms(filter) {
        const where = (filter === null || filter === void 0 ? void 0 : filter.departmentId) ? { departmentId: filter.departmentId } : undefined;
        return this.prisma.program.findMany({ where, include: { courses: true, cohorts: true } });
    }
    async createCourse(data) {
        const payload = {
            code: data.code,
            title: data.title,
            description: data.description,
            credits: data.credits,
            departmentId: data.departmentId,
            programId: data.programId,
            semester: data.semester,
        };
        return this.prisma.course.create({ data: payload });
    }
    async getCourses(filter) {
        const where = (filter === null || filter === void 0 ? void 0 : filter.programId) ? { programId: filter.programId } : undefined;
        return this.prisma.course.findMany({ where, include: { instructors: true, assignments: true, exams: true } });
    }
    async createCohort(data) {
        const payload = {
            name: data.name,
            programId: data.programId,
            intakeYear: data.intakeYear,
        };
        return this.prisma.cohort.create({ data: payload });
    }
    async enrollStudent(data) {
        var _a;
        const payload = {
            studentId: data.studentId,
            cohortId: data.cohortId,
            status: (_a = data.status) !== null && _a !== void 0 ? _a : undefined,
        };
        return this.prisma.enrollment.create({ data: payload });
    }
    async createAssignment(data) {
        const payload = {
            title: data.title,
            description: data.description,
            courseId: data.courseId,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            totalMarks: data.totalMarks,
        };
        return this.prisma.assignment.create({ data: payload });
    }
    async submitAssignment(data) {
        const payload = {
            assignmentId: data.assignmentId,
            studentId: data.studentId,
            submissionText: data.submissionText,
        };
        return this.prisma.assignmentSubmission.create({ data: payload });
    }
    async createExam(data) {
        const payload = {
            title: data.title,
            courseId: data.courseId,
            examDate: new Date(data.examDate),
            durationMin: data.durationMin,
            totalMarks: data.totalMarks,
            examType: data.examType,
        };
        return this.prisma.exam.create({ data: payload });
    }
    async recordExamResult(data) {
        const payload = {
            examId: data.examId,
            studentId: data.studentId,
            marks: data.marks,
            grade: data.grade,
            remarks: data.remarks,
        };
        return this.prisma.examResult.create({ data: payload });
    }
    async recordAttendance(data) {
        const payload = {
            studentId: data.studentId,
            date: data.date,
            status: data.status,
            courseId: data.courseId,
            cohortId: data.cohortId,
            recordedById: data.recordedById,
            remarks: data.remarks,
        };
        return this.prisma.attendance.create({ data: payload });
    }
};
exports.AcademicsService = AcademicsService;
exports.AcademicsService = AcademicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicsService);
//# sourceMappingURL=academics.service.js.map