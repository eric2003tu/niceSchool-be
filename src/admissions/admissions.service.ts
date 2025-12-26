import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, applicantId: string): Promise<any> {
    const dto: any = { ...createApplicationDto };
    
    // Remove any course references from DTO
    delete dto.course;
    delete dto.courseId;

    // normalize: accept either programId/departmentId or nested objects { program: { id } }
    if (!dto.programId && dto.program && typeof dto.program === 'object' && dto.program.id) {
      dto.programId = dto.program.id;
    }
    if (!dto.departmentId && dto.department && typeof dto.department === 'object' && dto.department.id) {
      dto.departmentId = dto.department.id;
    }

    // Validate required fields before any Prisma call
    if (!dto.programId || typeof dto.programId !== 'string') {
      throw new BadRequestException('programId is required and must be a string');
    }
    if (!dto.departmentId || typeof dto.departmentId !== 'string') {
      throw new BadRequestException('departmentId is required and must be a string');
    }

    // validate department
    const department = await this.prisma.department.findUnique({ where: { id: dto.departmentId } });
    if (!department) throw new BadRequestException('Invalid departmentId');

    // validate program and that it belongs to the department
    const program = await this.prisma.program.findUnique({ 
      where: { id: dto.programId }, 
      include: { department: true } 
    });
    if (!program) throw new BadRequestException('Invalid programId');
    if (program.department?.id !== dto.departmentId) {
      throw new BadRequestException('Program does not belong to the specified department');
    }

    // prevent duplicate application for same applicant/program
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        applicantId,
        programId: dto.programId,
      },
    });
    if (existingApplication) {
      throw new BadRequestException('Application already exists for this program');
    }

    // Set required fields for Prisma schema
    const applicationType = dto.applicationType || 'UNDERGRAD';
    const startSemester = dto.startSemester || dto.academicYear || '2025';

    // Create application (keep JSON fields as plain objects)
    return this.prisma.application.create({
      data: {
        applicantId,
        programId: dto.programId,
        personalInfo: dto.personalInfo ? { ...dto.personalInfo } : undefined,
        academicInfo: dto.academicInfo ? { ...dto.academicInfo } : undefined,
        documents: dto.documents ? { ...dto.documents } : undefined,
        applicationType,
        startSemester,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: ApplicationStatus,
    program?: string,
    department?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    // filter by programId
    if (program) where.programId = program;
    // filter by department via the program relation
    if (department) where.program = { departmentId: department };

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

  async findOne(id: string): Promise<any> {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { applicant: true, program: { include: { department: true } } },
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
      include: { program: { include: { department: true } } },
    });
  }

  async submitApplication(id: string): Promise<any> {
    const application = await this.findOne(id);
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new BadRequestException('Application is not in draft status');
    }
    // mark submittedAt and update status to SUBMITTED
    await this.prisma.application.update({ 
      where: { id }, 
      data: { submittedAt: new Date(), status: ApplicationStatus.SUBMITTED } 
    });
    return this.findOne(id);
  }

  async updateStatus(id: string, status: ApplicationStatus, adminNotes?: string): Promise<any> {
    let prismaStatus: ApplicationStatus;
    switch (status) {
      case ApplicationStatus.DRAFT:
        prismaStatus = ApplicationStatus.DRAFT;
        break;
      case ApplicationStatus.SUBMITTED:
        prismaStatus = ApplicationStatus.SUBMITTED;
        break;
      case ApplicationStatus.ADMITTED:
        prismaStatus = ApplicationStatus.ADMITTED;
        break;
      case ApplicationStatus.REJECTED:
        prismaStatus = ApplicationStatus.REJECTED;
        break;
      default:
        prismaStatus = ApplicationStatus.DRAFT;
    }
    const data: any = {
      status: prismaStatus,
      reviewedAt: new Date(),
    };
    if (adminNotes) data.adminNotes = adminNotes;
    
    // Update application status first
    const updated = await this.prisma.application.update({ where: { id }, data });

    // If admitted, auto-promote applicant to student and enroll
    if (prismaStatus === ApplicationStatus.ADMITTED) {
      // load application with applicant and program
      const application = await this.prisma.application.findUnique({
        where: { id },
        include: { applicant: true, program: true },
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
            personalInfo: application.personalInfo || undefined,
            academicInfo: application.academicInfo || undefined,
            documents: application.documents || undefined,
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
    for (let i = 0; i < 20; i++) {
      const candidate = gen();
      // check User and Student tables for collisions (transaction client may support both)
      let userFound = null;
      let studentFound = null;
      try { userFound = await prismaClient.user.findUnique({ where: { studentNumber: candidate } }); } catch (e) {}
      try { studentFound = await prismaClient.student ? await prismaClient.student.findUnique({ where: { studentNumber: candidate } }) : null; } catch (e) {}
      if (!userFound && !studentFound) return candidate;
    }
    // fallback: use timestamp-based value
    return `9${Date.now().toString().slice(-5)}`;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any> {
    const application = await this.findOne(id);
    if (application.submittedAt) {
      throw new BadRequestException('Cannot update submitted application');
    }
    // Only include programId and departmentId if they are defined
    const { programId, departmentId, ...rest } = updateApplicationDto;
    const data: any = {
      ...rest,
      personalInfo: updateApplicationDto.personalInfo ? { ...updateApplicationDto.personalInfo } : undefined,
      academicInfo: updateApplicationDto.academicInfo ? { ...updateApplicationDto.academicInfo } : undefined,
      documents: updateApplicationDto.documents ? { ...updateApplicationDto.documents } : undefined,
    };
    if (typeof programId === 'string') data.programId = programId;
    if (typeof departmentId === 'string') data.departmentId = departmentId;
    return this.prisma.application.update({
      where: { id },
      data,
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
    const [totalApplications, admittedApplications, submittedApplications, rejectedApplications] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: ApplicationStatus.ADMITTED as any } }),
      this.prisma.application.count({ where: { status: ApplicationStatus.SUBMITTED as any } }),
      this.prisma.application.count({ where: { status: ApplicationStatus.REJECTED as any } }),
    ]);
    return {
      total: totalApplications,
      admitted: admittedApplications,
      submitted: submittedApplications,
      rejected: rejectedApplications,
      admit_rate: totalApplications > 0 ? (admittedApplications / totalApplications) * 100 : 0,
    };
  }
}