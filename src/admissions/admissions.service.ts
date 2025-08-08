
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { $Enums } from '@prisma/client';


@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, applicantId: string): Promise<any> {
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        applicantId,
        program: createApplicationDto.program,
        academicYear: createApplicationDto.academicYear,
      },
    });
    if (existingApplication) {
      throw new BadRequestException('Application already exists for this program and academic year');
    }
    // Ensure JSON fields are plain objects
    return this.prisma.application.create({
      data: {
        ...createApplicationDto,
        applicantId,
        personalInfo: createApplicationDto.personalInfo ? { ...createApplicationDto.personalInfo } : undefined,
        academicInfo: createApplicationDto.academicInfo ? { ...createApplicationDto.academicInfo } : undefined,
        documents: createApplicationDto.documents ? { ...createApplicationDto.documents } : undefined,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: ApplicationStatus,
    program?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (program) where.program = program;
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

  async findOne(id: string): Promise<any> {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { applicant: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async findByApplicant(applicantId: string): Promise<any[]> {
    return this.prisma.application.findMany({
      where: { applicantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitApplication(id: string): Promise<any> {
    const application = await this.findOne(id);
    if (application.status !== $Enums.ApplicationStatus.PENDING) {
      throw new BadRequestException('Application is not in pending status');
    }
    return this.prisma.application.update({
      where: { id },
      data: {
        submittedAt: new Date(),
        status: $Enums.ApplicationStatus.APPROVED, // Use APPROVED for submitted
      },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus, adminNotes?: string): Promise<any> {
    let prismaStatus: $Enums.ApplicationStatus;
    switch (status) {
      case ApplicationStatus.PENDING:
        prismaStatus = $Enums.ApplicationStatus.PENDING;
        break;
      case ApplicationStatus.APPROVED:
        prismaStatus = $Enums.ApplicationStatus.APPROVED;
        break;
      case ApplicationStatus.REJECTED:
        prismaStatus = $Enums.ApplicationStatus.REJECTED;
        break;
      default:
        prismaStatus = $Enums.ApplicationStatus.PENDING;
    }
    const data: any = {
      status: prismaStatus,
      reviewedAt: new Date(),
    };
    if (adminNotes) data.adminNotes = adminNotes;
    return this.prisma.application.update({
      where: { id },
      data,
    });
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any> {
    const application = await this.findOne(id);
    if (application.submittedAt) {
      throw new BadRequestException('Cannot update submitted application');
    }
    // Ensure JSON fields are plain objects
    return this.prisma.application.update({
      where: { id },
      data: {
        ...updateApplicationDto,
        personalInfo: updateApplicationDto.personalInfo ? { ...updateApplicationDto.personalInfo } : undefined,
        academicInfo: updateApplicationDto.academicInfo ? { ...updateApplicationDto.academicInfo } : undefined,
        documents: updateApplicationDto.documents ? { ...updateApplicationDto.documents } : undefined,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.application.delete({ where: { id } });
  }

  async getRequirements(): Promise<any> {
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

  async getStats(): Promise<any> {
    const [totalApplications, approvedApplications, pendingApplications, rejectedApplications] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: $Enums.ApplicationStatus.APPROVED } }),
      this.prisma.application.count({ where: { status: $Enums.ApplicationStatus.PENDING } }),
      this.prisma.application.count({ where: { status: $Enums.ApplicationStatus.REJECTED } }),
    ]);
    return {
      total: totalApplications,
      approved: approvedApplications,
      pending: pendingApplications,
      rejected: rejectedApplications,
      approval_rate: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
    };
  }
}