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
let AdmissionsService = class AdmissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto, applicantId) {
        const existingApplication = await this.prisma.application.findFirst({
            where: {
                applicantId,
                program: createApplicationDto.program,
                academicYear: createApplicationDto.academicYear,
            },
        });
        if (existingApplication) {
            throw new common_1.BadRequestException('Application already exists for this program and academic year');
        }
        return this.prisma.application.create({
            data: Object.assign(Object.assign({}, createApplicationDto), { applicantId, personalInfo: createApplicationDto.personalInfo ? Object.assign({}, createApplicationDto.personalInfo) : undefined, academicInfo: createApplicationDto.academicInfo ? Object.assign({}, createApplicationDto.academicInfo) : undefined, documents: createApplicationDto.documents ? Object.assign({}, createApplicationDto.documents) : undefined }),
        });
    }
    async findAll(page = 1, limit = 10, status, program) {
        const where = {};
        if (status)
            where.status = status;
        if (program)
            where.program = program;
        const [data, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { applicant: true },
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
        return this.prisma.application.update({
            where: { id },
            data,
        });
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