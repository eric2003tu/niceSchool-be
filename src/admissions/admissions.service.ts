
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

      // run in transaction: ensure user update and membership creation happen together
      try {
        await this.prisma.$transaction(async (tx) => {
        // generate student number if missing
        if (!applicant.studentNumber) {
          const studentNumber = await this.generateUniqueStudentNumber(tx);
          await tx.user.update({ where: { id: applicant.id }, data: { studentNumber } });
        }

        // set role to STUDENT if not already
        if (applicant.role !== UserRole.STUDENT) {
          await tx.user.update({ where: { id: applicant.id }, data: { role: UserRole.STUDENT } });
        }

        // Merge personal details from the application into the user's profile (use the applicant details, not the currently logged-in admin)
        const personal = application.personalInfo as any;
        const updateData: any = {};
        if (personal) {
          if (personal.firstName) updateData.firstName = personal.firstName;
          if (personal.lastName) updateData.lastName = personal.lastName;
          if (personal.phone) updateData.phone = personal.phone;
          if (personal.dateOfBirth) {
            const d = new Date(personal.dateOfBirth);
            if (!isNaN(d.getTime())) updateData.dateOfBirth = d;
          }
        }
        if (Object.keys(updateData).length) {
          await tx.user.update({ where: { id: applicant.id }, data: updateData });
        }

        // create or ensure StudentProgram membership for the applied program (use tx as any until Prisma client is regenerated)
        if (!application.programId) {
          throw new BadRequestException('Application does not reference a program');
        }
        const programId = application.programId as string;
        const txAny = tx as any;
        const existingProg = await txAny.studentProgram.findFirst({ where: { studentId: applicant.id, programId } });
        if (!existingProg) {
          await txAny.studentProgram.create({ data: { studentId: applicant.id, programId } });
        }

        // create or ensure StudentCourse membership for the applied course (if any)
        if (application.courseId) {
          const courseId = application.courseId as string;
          const existingCourse = await txAny.studentCourse.findFirst({ where: { studentId: applicant.id, courseId } });
          if (!existingCourse) {
            await txAny.studentCourse.create({ data: { studentId: applicant.id, courseId } });
          }
        }
        });
      } catch (err: any) {
        // Catch known Prisma transaction errors and throw a clearer server error
        // (common when the Prisma client/schema is out of sync or the query engine restarted)
        // Log original error to server logs for debugging, and return a friendly error to the client.
        console.error('AdmissionsService.updateStatus transaction failed:', err);
        throw new InternalServerErrorException('Failed to complete application approval. Please check server logs and ensure Prisma client/schema are up to date.');
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