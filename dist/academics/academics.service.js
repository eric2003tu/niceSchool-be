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
const bcrypt = require("bcrypt");
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
    async getCohorts(filter) {
        const where = (filter === null || filter === void 0 ? void 0 : filter.programId) ? { programId: filter.programId } : undefined;
        return this.prisma.cohort.findMany({ where, include: { students: true, timetable: true, attendances: true } });
    }
    async getStudentsForProgram(programId) {
        const prismaAny = this.prisma;
        if (prismaAny.studentProgram) {
            const memberships = await prismaAny.studentProgram.findMany({ where: { programId }, include: { student: true } });
            return memberships.map((m) => {
                const s = m.student || {};
                const personal = s.personalInfo || {};
                const studentObj = {
                    id: s.id,
                    email: personal.email || (s.studentNumber ? `${s.studentNumber}@students.local` : null),
                    password: personal.password || null,
                    firstName: personal.firstName || personal.givenName || null,
                    lastName: personal.lastName || personal.familyName || null,
                    studentNumber: s.studentNumber || null,
                    role: 'STUDENT',
                    profileImage: personal.profileImage || null,
                    phone: personal.phone || null,
                    dateOfBirth: personal.dateOfBirth ? new Date(personal.dateOfBirth).toISOString() : null,
                    isActive: true,
                    lastLogin: null,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                };
                return { student: studentObj, enrolledAt: m.enrolledAt };
            });
        }
        const cohorts = await this.prisma.cohort.findMany({ where: { programId }, select: { id: true } });
        const cohortIds = cohorts.map(c => c.id);
        if (cohortIds.length === 0)
            return [];
        return this.prisma.enrollment.findMany({ where: { cohortId: { in: cohortIds } }, include: { student: true, cohort: true } });
    }
    async addStudentToProgram(programId, data) {
        if (data.cohortId) {
            const c = await this.prisma.cohort.findUnique({ where: { id: data.cohortId } });
            if (!c || c.programId !== programId)
                throw new common_1.BadRequestException('Invalid cohortId for this program');
        }
        else {
            const latest = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
            if (!latest)
                throw new common_1.BadRequestException('No cohort available for this program; provide cohortId');
            data.cohortId = latest.id;
        }
        return this.prisma.enrollment.create({ data: { studentId: data.studentId, cohortId: data.cohortId } });
    }
    async createStudentAndEnroll(programId, data) {
        let cohortId = data.cohortId;
        if (cohortId) {
            const cohort = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
            if (!cohort || cohort.programId !== programId)
                throw new common_1.BadRequestException('Invalid cohortId for this program');
        }
        else {
            const defaultCohort = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
            if (!defaultCohort)
                throw new common_1.BadRequestException('No cohort available for this program; provide cohortId');
            cohortId = defaultCohort.id;
        }
        const generateStudentNumber = async () => {
            const num = Math.floor(100000 + Math.random() * 900000).toString();
            const exists = await this.prisma.user.findUnique({ where: { studentNumber: num } });
            if (exists)
                return generateStudentNumber();
            return num;
        };
        const studentNumber = await generateStudentNumber();
        const tmpPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const hashed = await bcrypt.hash(tmpPassword, 10);
        const newUser = await this.prisma.user.create({ data: {
                email: `${studentNumber}@students.local`,
                password: hashed,
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                role: 'STUDENT',
                studentNumber,
            } });
        const enrollment = await this.prisma.enrollment.create({ data: { studentId: newUser.id, cohortId } });
        return { student: newUser, enrollment, temporaryPassword: tmpPassword };
    }
    async getTeachersForProgram(programId) {
        const courses = await this.prisma.course.findMany({ where: { programId }, select: { id: true } });
        const courseIds = courses.map(c => c.id);
        if (courseIds.length === 0)
            return [];
        return this.prisma.faculty.findMany({ where: { courses: { some: { id: { in: courseIds } } } } });
    }
    async addTeacherToProgram(programId, facultyId) {
        const courses = await this.prisma.course.findMany({ where: { programId }, select: { id: true } });
        if (courses.length === 0)
            throw new common_1.BadRequestException('No courses found for this program');
        const ops = courses.map(c => this.prisma.course.update({ where: { id: c.id }, data: { instructors: { connect: { id: facultyId } } } }));
        return this.prisma.$transaction(ops);
    }
    async getEnrollmentsForProgram(programId) {
        const cohorts = await this.prisma.cohort.findMany({ where: { programId }, select: { id: true } });
        const cohortIds = cohorts.map(c => c.id);
        if (cohortIds.length === 0)
            return [];
        return this.prisma.enrollment.findMany({ where: { cohortId: { in: cohortIds } }, include: { student: true, cohort: true } });
    }
    async getEnrollmentForProgram(programId, enrollmentId) {
        const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId }, include: { student: true, cohort: true } });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        if (!enrollment.cohortId)
            throw new common_1.BadRequestException('Enrollment missing cohort');
        const cohort = await this.prisma.cohort.findUnique({ where: { id: enrollment.cohortId } });
        if (!cohort || cohort.programId !== programId)
            throw new common_1.BadRequestException('Enrollment does not belong to this program');
        return enrollment;
    }
    async createEnrollmentForProgram(programId, data) {
        var _a;
        let cohortId = data.cohortId;
        if (cohortId) {
            const cohort = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
            if (!cohort || cohort.programId !== programId)
                throw new common_1.BadRequestException('Invalid cohortId for this program');
        }
        else {
            const defaultCohort = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
            if (!defaultCohort)
                throw new common_1.BadRequestException('No cohort found for this program; provide cohortId');
            cohortId = defaultCohort.id;
        }
        return this.prisma.enrollment.create({ data: { studentId: data.studentId, cohortId, status: (_a = data.status) !== null && _a !== void 0 ? _a : undefined } });
    }
    async updateEnrollmentForProgram(programId, enrollmentId, data) {
        const enrollment = await this.getEnrollmentForProgram(programId, enrollmentId);
        const update = {};
        if (data.status)
            update.status = data.status;
        if (data.cohortId) {
            const newCohort = await this.prisma.cohort.findUnique({ where: { id: data.cohortId } });
            if (!newCohort || newCohort.programId !== programId)
                throw new common_1.BadRequestException('Invalid cohortId for this program');
            update.cohortId = data.cohortId;
        }
        return this.prisma.enrollment.update({ where: { id: enrollmentId }, data: update });
    }
    async removeEnrollmentForProgram(programId, enrollmentId) {
        const enrollment = await this.getEnrollmentForProgram(programId, enrollmentId);
        return this.prisma.enrollment.delete({ where: { id: enrollment.id } });
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
    async findStudentByStudentNumber(studentNumber) {
        const user = await this.prisma.user.findUnique({ where: { studentNumber }, include: { enrollments: { include: { cohort: true } } } });
        if (!user)
            throw new common_1.NotFoundException('Student not found');
        return user;
    }
};
exports.AcademicsService = AcademicsService;
exports.AcademicsService = AcademicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicsService);
//# sourceMappingURL=academics.service.js.map