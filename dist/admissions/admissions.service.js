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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const application_status_enum_1 = require("../common/enums/application-status.enum");
let AdmissionsService = class AdmissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneApplicant(applicantId) {
        var _a, _b;
        const applications = await this.prisma.application.findMany({
            where: { applicantId },
            include: {
                applicant: { include: { profile: true } },
                program: true,
            },
        });
        if (!applications.length) {
            throw new common_1.NotFoundException('Applicant not found or has no applications');
        }
        const app = applications[0];
        const student = await this.prisma.student.findFirst({ where: { profile: { accountId: applicantId } }, include: { cohort: true, program: true } });
        return {
            applicant: {
                id: app.applicant.id,
                email: app.applicant.email,
                firstName: (_a = app.applicant.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                lastName: (_b = app.applicant.profile) === null || _b === void 0 ? void 0 : _b.lastName,
                role: app.applicant.role,
                status: app.applicant.status,
            },
            applications: applications.map(a => ({
                id: a.id,
                status: a.status,
                program: { id: a.program.id, name: a.program.name },
                startSemester: a.startSemester,
                createdAt: a.createdAt,
            })),
            registered: !!student,
            cohort: (student === null || student === void 0 ? void 0 : student.cohort) ? { id: student.cohort.id, name: student.cohort.name } : null,
            program: (student === null || student === void 0 ? void 0 : student.program) ? { id: student.program.id, name: student.program.name } : null,
        };
    }
    async create(createApplicationDto, applicantId) {
        var _a;
        const dto = Object.assign({}, createApplicationDto);
        delete dto.course;
        delete dto.courseId;
        if (!dto.programId && dto.program && typeof dto.program === 'object' && dto.program.id) {
            dto.programId = dto.program.id;
        }
        if (!dto.departmentId && dto.department && typeof dto.department === 'object' && dto.department.id) {
            dto.departmentId = dto.department.id;
        }
        if (!dto.programId || typeof dto.programId !== 'string') {
            throw new common_1.BadRequestException('programId is required and must be a string');
        }
        if (!dto.departmentId || typeof dto.departmentId !== 'string') {
            throw new common_1.BadRequestException('departmentId is required and must be a string');
        }
        const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
        if (!department)
            throw new common_1.BadRequestException('Invalid departmentId');
        const program = await this.prisma.program.findUnique({
            where: { id: dto.programId },
            include: { department: true }
        });
        if (!program)
            throw new common_1.BadRequestException('Invalid programId');
        if (((_a = program.department) === null || _a === void 0 ? void 0 : _a.id) !== dto.departmentId) {
            throw new common_1.BadRequestException('Program does not belong to the specified department');
        }
        const existingApplication = await this.prisma.application.findFirst({
            where: {
                applicantId,
                programId: dto.programId,
            },
        });
        if (existingApplication) {
            throw new common_1.BadRequestException('Application already exists for this program');
        }
        const applicationType = dto.applicationType || 'UNDERGRAD';
        const startSemester = dto.startSemester || dto.academicYear || '2025';
        return this.prisma.application.create({
            data: {
                applicantId,
                programId: dto.programId,
                personalInfo: dto.personalInfo ? Object.assign({}, dto.personalInfo) : undefined,
                academicInfo: dto.academicInfo ? Object.assign({}, dto.academicInfo) : undefined,
                documents: dto.documents ? Object.assign({}, dto.documents) : undefined,
                applicationType,
                startSemester,
            },
        });
    }
    async findAll(page = 1, limit = 10, status, program, department) {
        const where = {};
        if (status && Object.values(application_status_enum_1.ApplicationStatus).includes(status)) {
            where.status = status;
        }
        else if (status) {
            console.warn(`Invalid status filter: ${status}. Valid values are: ${Object.values(application_status_enum_1.ApplicationStatus).join(', ')}`);
        }
        if (program)
            where.programId = program;
        if (department)
            where.program = { departmentId: department };
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { applicant: true, program: true },
            }),
            this.prisma.application.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findAllApplicants(page = 1, limit = 20) {
        var _a, _b;
        const applications = await this.prisma.application.findMany({
            where: { status: { not: undefined } },
            include: {
                applicant: { include: { profile: true } },
                program: { include: { cohorts: true } },
            },
        });
        const applicantsMap = new Map();
        for (const app of applications) {
            if (!applicantsMap.has(app.applicantId)) {
                const student = await this.prisma.student.findFirst({ where: { profile: { accountId: app.applicantId } }, include: { cohort: true, program: true } });
                applicantsMap.set(app.applicantId, {
                    applicant: {
                        id: app.applicant.id,
                        email: app.applicant.email,
                        firstName: (_a = app.applicant.profile) === null || _a === void 0 ? void 0 : _a.firstName,
                        lastName: (_b = app.applicant.profile) === null || _b === void 0 ? void 0 : _b.lastName,
                        role: app.applicant.role,
                        status: app.applicant.status,
                    },
                    applications: applications.filter(a => a.applicantId === app.applicantId).map(a => ({
                        id: a.id,
                        status: a.status,
                        program: { id: a.program.id, name: a.program.name },
                        startSemester: a.startSemester,
                        createdAt: a.createdAt,
                    })),
                    registered: !!student,
                    cohort: (student === null || student === void 0 ? void 0 : student.cohort) ? { id: student.cohort.id, name: student.cohort.name } : null,
                    program: (student === null || student === void 0 ? void 0 : student.program) ? { id: student.program.id, name: student.program.name } : null,
                });
            }
        }
        const allApplicants = Array.from(applicantsMap.values());
        const total = allApplicants.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = allApplicants.slice(start, end);
        return { data, total };
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { applicant: true, program: { include: { department: true } } },
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
            include: { program: { include: { department: true } } },
        });
    }
    async submitApplication(id) {
        const application = await this.findOne(id);
        if (application.status !== application_status_enum_1.ApplicationStatus.DRAFT) {
            throw new common_1.BadRequestException('Application is not in draft status');
        }
        await this.prisma.application.update({
            where: { id },
            data: { submittedAt: new Date(), status: application_status_enum_1.ApplicationStatus.SUBMITTED }
        });
        return this.findOne(id);
    }
    async updateStatus(id, status, adminNotes) {
        if (!Object.values(application_status_enum_1.ApplicationStatus).includes(status)) {
            throw new common_1.BadRequestException(`Invalid status: ${status}. Valid values are: ${Object.values(application_status_enum_1.ApplicationStatus).join(', ')}`);
        }
        const data = {
            status: status,
            reviewedAt: new Date(),
        };
        if (adminNotes)
            data.adminNotes = adminNotes;
        const updated = await this.prisma.application.update({ where: { id }, data });
        if (status === application_status_enum_1.ApplicationStatus.ADMITTED || status === application_status_enum_1.ApplicationStatus.CONDITIONALLY_ADMITTED) {
            try {
                await this.prisma.$transaction(async (tx) => {
                    const application = await tx.application.findUnique({
                        where: { id },
                        include: { program: true },
                    });
                    if (!application) {
                        throw new common_1.NotFoundException('Application not found');
                    }
                    const personal = application.personalInfo;
                    if (!personal || typeof personal !== 'object') {
                        throw new common_1.BadRequestException('Application personalInfo is missing; cannot create student record');
                    }
                    const studentNumber = await this.generateUniqueStudentNumber(tx);
                    const studentPayload = {
                        applicationId: application.id,
                        studentNumber,
                        personalInfo: application.personalInfo || undefined,
                        academicInfo: application.academicInfo || undefined,
                        documents: application.documents || undefined,
                        programId: application.programId,
                    };
                    await tx.student.create({ data: studentPayload });
                });
            }
            catch (err) {
                console.error('Failed to create student record:', err);
            }
        }
        return updated;
    }
    async generateUniqueStudentNumber(prismaClient) {
        const gen = () => Math.floor(100000 + Math.random() * 900000).toString();
        for (let i = 0; i < 20; i++) {
            const candidate = gen();
            let userFound = null;
            let studentFound = null;
            try {
                userFound = await prismaClient.user.findUnique({ where: { studentNumber: candidate } });
            }
            catch (e) { }
            try {
                studentFound = await prismaClient.student ? await prismaClient.student.findUnique({ where: { studentNumber: candidate } }) : null;
            }
            catch (e) { }
            if (!userFound && !studentFound)
                return candidate;
        }
        return `9${Date.now().toString().slice(-5)}`;
    }
    async update(id, updateApplicationDto) {
        const application = await this.findOne(id);
        if (application.submittedAt) {
            throw new common_1.BadRequestException('Cannot update submitted application');
        }
        const { programId, departmentId } = updateApplicationDto, rest = __rest(updateApplicationDto, ["programId", "departmentId"]);
        const data = Object.assign(Object.assign({}, rest), { personalInfo: updateApplicationDto.personalInfo ? Object.assign({}, updateApplicationDto.personalInfo) : undefined, academicInfo: updateApplicationDto.academicInfo ? Object.assign({}, updateApplicationDto.academicInfo) : undefined, documents: updateApplicationDto.documents ? Object.assign({}, updateApplicationDto.documents) : undefined });
        if (typeof programId === 'string')
            data.programId = programId;
        if (typeof departmentId === 'string')
            data.departmentId = departmentId;
        return this.prisma.application.update({
            where: { id },
            data,
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
        const [totalApplications, admittedApplications, submittedApplications, rejectedApplications] = await Promise.all([
            this.prisma.application.count(),
            this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.ADMITTED } }),
            this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.SUBMITTED } }),
            this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.REJECTED } }),
        ]);
        const draftApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.DRAFT } });
        const underReviewApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.UNDER_REVIEW } });
        const interviewScheduledApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.INTERVIEW_SCHEDULED } });
        const conditionallyAdmittedApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.CONDITIONALLY_ADMITTED } });
        const waitlistedApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.WAITLISTED } });
        const withdrawnApplications = await this.prisma.application.count({ where: { status: application_status_enum_1.ApplicationStatus.WITHDRAWN } });
        return {
            total: totalApplications,
            byStatus: {
                draft: draftApplications,
                submitted: submittedApplications,
                under_review: underReviewApplications,
                interview_scheduled: interviewScheduledApplications,
                admitted: admittedApplications,
                conditionally_admitted: conditionallyAdmittedApplications,
                waitlisted: waitlistedApplications,
                rejected: rejectedApplications,
                withdrawn: withdrawnApplications,
            },
            admit_rate: totalApplications > 0 ? (admittedApplications / totalApplications) * 100 : 0,
        };
    }
};
exports.AdmissionsService = AdmissionsService;
exports.AdmissionsService = AdmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdmissionsService);
//# sourceMappingURL=admissions.service.js.map