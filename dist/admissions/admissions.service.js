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
exports.AdmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const application_status_enum_1 = require("../common/enums/application-status.enum");
const client_1 = require("@prisma/client");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let AdmissionsService = class AdmissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto, applicantId) {
        const dto = createApplicationDto;
        if (!dto.programId && dto.program && typeof dto.program === 'object' && dto.program.id) {
            dto.programId = dto.program.id;
        }
        if (!dto.departmentId && dto.department && typeof dto.department === 'object' && dto.department.id) {
            dto.departmentId = dto.department.id;
        }
        if (!dto.courseId && dto.course && typeof dto.course === 'object' && dto.course.id) {
            dto.courseId = dto.course.id;
        }
        const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
        if (!department)
            throw new common_1.BadRequestException('Invalid departmentId');
        const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
        if (!program)
            throw new common_1.BadRequestException('Invalid programId');
        if (program.departmentId !== dto.departmentId) {
            throw new common_1.BadRequestException('Program does not belong to the specified department');
        }
        const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
        if (!course)
            throw new common_1.BadRequestException('Invalid courseId');
        if (course.programId !== dto.programId) {
            throw new common_1.BadRequestException('Course does not belong to the specified program');
        }
        const existingApplication = await this.prisma.application.findFirst({
            where: {
                applicantId,
                programId: dto.programId,
                academicYear: dto.academicYear,
            },
        });
        if (existingApplication) {
            throw new common_1.BadRequestException('Application already exists for this program and academic year');
        }
        return this.prisma.application.create({
            data: {
                academicYear: dto.academicYear,
                applicantId,
                programId: dto.programId,
                courseId: dto.courseId,
                personalInfo: dto.personalInfo ? Object.assign({}, dto.personalInfo) : undefined,
                academicInfo: dto.academicInfo ? Object.assign({}, dto.academicInfo) : undefined,
                documents: dto.documents ? Object.assign({}, dto.documents) : undefined,
            },
        });
    }
    async findAll(page = 1, limit = 10, status, program, department, course) {
        const where = {};
        if (status)
            where.status = status;
        if (program)
            where.programId = program;
        if (course)
            where.courseId = course;
        if (department)
            where.program = { departmentId: department };
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { applicant: true, program: true, course: true },
            }),
            this.prisma.application.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { applicant: true },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return application;
    }
    async findByApplicant(applicantId) {
        return this.prisma.application.findMany({
            where: { applicantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async submitApplication(id) {
        const application = await this.findOne(id);
        if (application.status !== client_1.$Enums.ApplicationStatus.PENDING) {
            throw new common_1.BadRequestException('Application is not in pending status');
        }
        return this.prisma.application.update({
            where: { id },
            data: {
                submittedAt: new Date(),
                status: client_1.$Enums.ApplicationStatus.APPROVED,
            },
        });
    }
    async updateStatus(id, status, adminNotes) {
        let prismaStatus;
        switch (status) {
            case application_status_enum_1.ApplicationStatus.PENDING:
                prismaStatus = client_1.$Enums.ApplicationStatus.PENDING;
                break;
            case application_status_enum_1.ApplicationStatus.APPROVED:
                prismaStatus = client_1.$Enums.ApplicationStatus.APPROVED;
                break;
            case application_status_enum_1.ApplicationStatus.REJECTED:
                prismaStatus = client_1.$Enums.ApplicationStatus.REJECTED;
                break;
            default:
                prismaStatus = client_1.$Enums.ApplicationStatus.PENDING;
        }
        const data = {
            status: prismaStatus,
            reviewedAt: new Date(),
        };
        if (adminNotes)
            data.adminNotes = adminNotes;
        const updated = await this.prisma.application.update({ where: { id }, data });
        if (prismaStatus === client_1.$Enums.ApplicationStatus.APPROVED) {
            const application = await this.prisma.application.findUnique({
                where: { id },
                include: { applicant: true },
            });
            if (!application)
                throw new common_1.NotFoundException('Application not found');
            const applicant = application.applicant;
            try {
                await this.prisma.$transaction(async (tx) => {
                    if (!applicant.studentNumber) {
                        const studentNumber = await this.generateUniqueStudentNumber(tx);
                        await tx.user.update({ where: { id: applicant.id }, data: { studentNumber } });
                    }
                    if (applicant.role !== user_role_enum_1.UserRole.STUDENT) {
                        await tx.user.update({ where: { id: applicant.id }, data: { role: user_role_enum_1.UserRole.STUDENT } });
                    }
                    const personal = application.personalInfo;
                    const updateData = {};
                    if (personal) {
                        if (personal.firstName)
                            updateData.firstName = personal.firstName;
                        if (personal.lastName)
                            updateData.lastName = personal.lastName;
                        if (personal.phone)
                            updateData.phone = personal.phone;
                        if (personal.dateOfBirth) {
                            const d = new Date(personal.dateOfBirth);
                            if (!isNaN(d.getTime()))
                                updateData.dateOfBirth = d;
                        }
                    }
                    if (Object.keys(updateData).length) {
                        await tx.user.update({ where: { id: applicant.id }, data: updateData });
                    }
                    if (!application.programId) {
                        throw new common_1.BadRequestException('Application does not reference a program');
                    }
                    const programId = application.programId;
                    const txAny = tx;
                    const existingProg = await txAny.studentProgram.findFirst({ where: { studentId: applicant.id, programId } });
                    if (!existingProg) {
                        await txAny.studentProgram.create({ data: { studentId: applicant.id, programId } });
                    }
                    if (application.courseId) {
                        const courseId = application.courseId;
                        const existingCourse = await txAny.studentCourse.findFirst({ where: { studentId: applicant.id, courseId } });
                        if (!existingCourse) {
                            await txAny.studentCourse.create({ data: { studentId: applicant.id, courseId } });
                        }
                    }
                });
            }
            catch (err) {
                console.error('AdmissionsService.updateStatus transaction failed:', err);
                throw new common_1.InternalServerErrorException('Failed to complete application approval. Please check server logs and ensure Prisma client/schema are up to date.');
            }
        }
        return updated;
    }
    async generateUniqueStudentNumber(prismaClient) {
        const gen = () => Math.floor(100000 + Math.random() * 900000).toString();
        for (let i = 0; i < 10; i++) {
            const candidate = gen();
            const found = await prismaClient.user.findUnique({ where: { studentNumber: candidate } });
            if (!found)
                return candidate;
        }
        return `9${Date.now().toString().slice(-5)}`;
    }
    async update(id, updateApplicationDto) {
        const application = await this.findOne(id);
        if (application.submittedAt) {
            throw new common_1.BadRequestException('Cannot update submitted application');
        }
        return this.prisma.application.update({
            where: { id },
            data: Object.assign(Object.assign({}, updateApplicationDto), { personalInfo: updateApplicationDto.personalInfo ? Object.assign({}, updateApplicationDto.personalInfo) : undefined, academicInfo: updateApplicationDto.academicInfo ? Object.assign({}, updateApplicationDto.academicInfo) : undefined, documents: updateApplicationDto.documents ? Object.assign({}, updateApplicationDto.documents) : undefined }),
        });
    }
    async remove(id) {
        await this.prisma.application.delete({ where: { id } });
    }
    async getRequirements() {
        return {
            documents: [
                { name: 'Academic Transcript', required: true },
                { name: 'Recommendation Letter', required: true },
                { name: 'Personal Statement', required: true },
                { name: 'ID Document', required: true },
                { name: 'Passport Photo', required: true },
            ],
            programs: [
                'Computer Science',
                'Business Administration',
                'Engineering',
                'Medicine',
                'Arts & Humanities',
            ],
            deadlines: {
                fall: '2025-03-15',
                spring: '2025-10-15',
            },
            fees: {
                application: 50,
                tuition: 25000,
            },
        };
    }
    async getStats() {
        const [totalApplications, approvedApplications, pendingApplications, rejectedApplications] = await Promise.all([
            this.prisma.application.count(),
            this.prisma.application.count({ where: { status: client_1.$Enums.ApplicationStatus.APPROVED } }),
            this.prisma.application.count({ where: { status: client_1.$Enums.ApplicationStatus.PENDING } }),
            this.prisma.application.count({ where: { status: client_1.$Enums.ApplicationStatus.REJECTED } }),
        ]);
        return {
            total: totalApplications,
            approved: approvedApplications,
            pending: pendingApplications,
            rejected: rejectedApplications,
            approval_rate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
        };
    }
};
exports.AdmissionsService = AdmissionsService;
exports.AdmissionsService = AdmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdmissionsService);
//# sourceMappingURL=admissions.service.js.map