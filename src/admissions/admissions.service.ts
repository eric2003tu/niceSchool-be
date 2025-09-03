
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { $Enums } from '@prisma/client';
import { UserRole } from '../common/enums/user-role.enum';


@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, applicantId: string): Promise<any> {
    const dto: any = createApplicationDto as any;

    // normalize: accept either programId/departmentId/courseId or nested objects { program: { id } }
    if (!dto.programId && dto.program && typeof dto.program === 'object' && dto.program.id) {
      dto.programId = dto.program.id;
    }
    if (!dto.departmentId && dto.department && typeof dto.department === 'object' && dto.department.id) {
      dto.departmentId = dto.department.id;
    }
    if (!dto.courseId && dto.course && typeof dto.course === 'object' && dto.course.id) {
      dto.courseId = dto.course.id;
    }

    // validate department
    const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!department) throw new BadRequestException('Invalid departmentId');

    // validate program and that it belongs to the department
    const program = await this.prisma.program.findUnique({ where: { id: dto.programId } });
    if (!program) throw new BadRequestException('Invalid programId');
    if (program.departmentId !== dto.departmentId) {
      throw new BadRequestException('Program does not belong to the specified department');
    }

    // validate course and that it belongs to the program
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new BadRequestException('Invalid courseId');
    if (course.programId !== dto.programId) {
      throw new BadRequestException('Course does not belong to the specified program');
    }

    // prevent duplicate application for same applicant/program/academicYear
    const existingApplication = await (this.prisma.application as any).findFirst({
      where: {
        applicantId,
        programId: dto.programId,
        academicYear: dto.academicYear,
      },
    });
    if (existingApplication) {
      throw new BadRequestException('Application already exists for this program and academic year');
    }

    // Create application (keep JSON fields as plain objects)
    return (this.prisma.application as any).create({
      data: {
        academicYear: dto.academicYear,
        applicantId,
        programId: dto.programId,
        courseId: dto.courseId,
        personalInfo: dto.personalInfo ? { ...dto.personalInfo } : undefined,
        academicInfo: dto.academicInfo ? { ...dto.academicInfo } : undefined,
        documents: dto.documents ? { ...dto.documents } : undefined,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: ApplicationStatus,
    program?: string,
    department?: string,
    course?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    // filter by programId
    if (program) where.programId = program;
    // filter by courseId
    if (course) where.courseId = course;
    // filter by department via the program relation
    if (department) where.program = { departmentId: department };

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
    // Update application status first
    const updated = await this.prisma.application.update({ where: { id }, data });

    // If approved, auto-promote applicant to student and enroll
    if (prismaStatus === $Enums.ApplicationStatus.APPROVED) {
      // load application with applicant and program
      const application = await this.prisma.application.findUnique({
        where: { id },
        include: { applicant: true },
      });
      if (!application) throw new NotFoundException('Application not found');

      const applicant = application.applicant;

      // run in transaction: create a Student record from the application data (detached from User)
      try {
        await this.prisma.$transaction(async (tx) => {
          const personal = application.personalInfo as any;
          if (!personal || typeof personal !== 'object') {
            throw new BadRequestException('Application personalInfo is missing; cannot create student record');
          }

          const studentNumber = await this.generateUniqueStudentNumber(tx);

          const studentPayload: any = {
            applicationId: application.id,
            studentNumber,
            programId: application.programId || undefined,
            academicYear: application.academicYear || undefined,
            personalInfo: application.personalInfo || undefined,
            academicInfo: application.academicInfo || undefined,
            documents: application.documents || undefined,
            personalStatement: application.personalStatement || undefined,
          };

          await tx.student.create({ data: studentPayload });
        });
      } catch (err: any) {
        console.error('AdmissionsService.updateStatus transaction failed:', err);
        throw new InternalServerErrorException('Failed to create student from application. Please check server logs and ensure Prisma client/schema are up to date.');
      }
    }

    return updated;
  }

  // helper: generate a unique 6-digit student number using the provided transaction/client
  private async generateUniqueStudentNumber(prismaClient: any): Promise<string> {
    const gen = () => Math.floor(100000 + Math.random() * 900000).toString();
    for (let i = 0; i < 10; i++) {
      const candidate = gen();
      const found = await prismaClient.user.findUnique({ where: { studentNumber: candidate } });
      if (!found) return candidate;
    }
    // fallback: use timestamp-based value
    return `9${Date.now().toString().slice(-5)}`;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any> {
    const application = await this.findOne(id);
    if (application.submittedAt) {
      throw new BadRequestException('Cannot update submitted application');
    }
    // Ensure JSON fields are plain objects
    return (this.prisma.application as any).update({
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