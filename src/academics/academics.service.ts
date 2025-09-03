import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  // Departments
  async createDepartment(data: CreateDepartmentDto) {
  const payload: any = {
    name: data.name,
    code: data.code,
    description: data.description,
  };
  if (data.headId) {
    // validate faculty exists to avoid foreign key constraint error from Prisma
    const head = await this.prisma.faculty.findUnique({ where: { id: data.headId } });
    if (!head) throw new BadRequestException('Invalid headId: faculty not found');
    payload.headId = data.headId;
  }
  return this.prisma.department.create({ data: payload });
  }

  async getDepartments() {
    return this.prisma.department.findMany({ include: { programs: true, courses: true, head: true } });
  }

  async getDepartment(id: string) {
    const dep = await this.prisma.department.findUnique({ where: { id }, include: { programs: true, courses: true, head: true } });
    if (!dep) throw new NotFoundException('Department not found');
    return dep;
  }

  // Programs
  async createProgram(data: CreateProgramDto) {
  const payload: any = {
    name: data.name,
    code: data.code,
    level: data.level,
    departmentId: data.departmentId,
    durationYears: data.durationYears,
    description: data.description,
  };
  return this.prisma.program.create({ data: payload });
  }

  async getPrograms(filter?: { departmentId?: string }) {
    const where = filter?.departmentId ? { departmentId: filter.departmentId } : undefined;
    return this.prisma.program.findMany({ where, include: { courses: true, cohorts: true } });
  }

  // Courses
  async createCourse(data: CreateCourseDto) {
  const payload: any = {
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

  async getCourses(filter?: { programId?: string }) {
    const where = filter?.programId ? { programId: filter.programId } : undefined;
    return this.prisma.course.findMany({ where, include: { instructors: true, assignments: true, exams: true } });
  }

  async getCohorts(filter?: { programId?: string }) {
    const where = filter?.programId ? { programId: filter.programId } : undefined;
    return this.prisma.cohort.findMany({ where, include: { students: true, timetable: true, attendances: true } });
  }

  // Students within a program
  async getStudentsForProgram(programId: string) {
    // Prefer direct StudentProgram membership records created on application approval.
    // Use a safe any-cast since the Prisma client may need regeneration after schema changes.
    const prismaAny = this.prisma as any;
    if (prismaAny.studentProgram) {
      const memberships = await prismaAny.studentProgram.findMany({ where: { programId }, include: { student: true } });
      // return students with flattened personalInfo so API consumers see a User-like shape
      return memberships.map((m: any) => {
        const s = m.student || {};
        const personal = s.personalInfo || {};
        const studentObj: any = {
          id: s.id,
          email: personal.email || (s.studentNumber ? `${s.studentNumber}@students.local` : null),
          // Detached Student does not store password; keep null to avoid leaking sensitive values
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

    // Fallback: find cohorts for the program then list enrollments
    const cohorts = await this.prisma.cohort.findMany({ where: { programId }, select: { id: true } });
    const cohortIds = cohorts.map(c => c.id);
    if (cohortIds.length === 0) return [];
    return this.prisma.enrollment.findMany({ where: { cohortId: { in: cohortIds } }, include: { student: true, cohort: true } });
  }

  async addStudentToProgram(programId: string, data: { studentId: string; cohortId?: string }) {
    // If cohortId provided, ensure cohort belongs to program
    if (data.cohortId) {
      const c = await this.prisma.cohort.findUnique({ where: { id: data.cohortId } });
      if (!c || c.programId !== programId) throw new BadRequestException('Invalid cohortId for this program');
    } else {
      // choose a default cohort (latest) for the program
      const latest = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
      if (!latest) throw new BadRequestException('No cohort available for this program; provide cohortId');
      data.cohortId = latest.id;
    }
    // Create enrollment (unique constraint will prevent duplicates)
    return this.prisma.enrollment.create({ data: { studentId: data.studentId, cohortId: data.cohortId } });
  }

  // Create a new student user and enroll into a program (creates user record)
  async createStudentAndEnroll(programId: string, data: { firstName: string; lastName: string; dateOfBirth?: string; age?: number; cohortId?: string }) {
    // determine cohort
    let cohortId = data.cohortId;
    if (cohortId) {
      const cohort = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
      if (!cohort || cohort.programId !== programId) throw new BadRequestException('Invalid cohortId for this program');
    } else {
      const defaultCohort = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
      if (!defaultCohort) throw new BadRequestException('No cohort available for this program; provide cohortId');
      cohortId = defaultCohort.id;
    }

    // generate unique 6-digit student number
    const generateStudentNumber = async () => {
      const num = Math.floor(100000 + Math.random() * 900000).toString();
  const exists = await (this.prisma.user as any).findUnique({ where: { studentNumber: num } });
      if (exists) return generateStudentNumber();
      return num;
    };

    const studentNumber = await generateStudentNumber();

    // create user with a default password (should be reset via reset flow)
    const tmpPassword = Math.random().toString(36).slice(-8) + 'A1!';
    const hashed = await bcrypt.hash(tmpPassword, 10);

    const newUser = await (this.prisma.user as any).create({ data: {
      email: `${studentNumber}@students.local`,
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      role: 'STUDENT',
      studentNumber,
    } });

    // enroll
    const enrollment = await this.prisma.enrollment.create({ data: { studentId: newUser.id, cohortId } });

    return { student: newUser, enrollment, temporaryPassword: tmpPassword };
  }

  // Teachers within a program
  async getTeachersForProgram(programId: string) {
    // Teachers are faculty assigned to courses under the program
    const courses = await this.prisma.course.findMany({ where: { programId }, select: { id: true } });
    const courseIds = courses.map(c => c.id);
    if (courseIds.length === 0) return [];
    // The instructors relation is a many-to-many through the implicit relation; Prisma stores it via a join table but we can query faculties who teach courses
    return this.prisma.faculty.findMany({ where: { courses: { some: { id: { in: courseIds } } } } });
  }

  async addTeacherToProgram(programId: string, facultyId: string) {
    // assign the teacher to all current courses in the program
    const courses = await this.prisma.course.findMany({ where: { programId }, select: { id: true } });
    if (courses.length === 0) throw new BadRequestException('No courses found for this program');
    const ops = courses.map(c => this.prisma.course.update({ where: { id: c.id }, data: { instructors: { connect: { id: facultyId } } } }));
    return this.prisma.$transaction(ops);
  }

  // Enrollment CRUD scoped to program
  async getEnrollmentsForProgram(programId: string) {
    // find cohorts for the program
    const cohorts = await this.prisma.cohort.findMany({ where: { programId }, select: { id: true } });
    const cohortIds = cohorts.map(c => c.id);
    if (cohortIds.length === 0) return [];
    return this.prisma.enrollment.findMany({ where: { cohortId: { in: cohortIds } }, include: { student: true, cohort: true } });
  }

  async getEnrollmentForProgram(programId: string, enrollmentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId }, include: { student: true, cohort: true } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    // ensure cohort belongs to program
    if (!enrollment.cohortId) throw new BadRequestException('Enrollment missing cohort');
    const cohort = await this.prisma.cohort.findUnique({ where: { id: enrollment.cohortId } });
    if (!cohort || cohort.programId !== programId) throw new BadRequestException('Enrollment does not belong to this program');
    return enrollment;
  }

  async createEnrollmentForProgram(programId: string, data: { studentId: string; cohortId?: string; status?: string }) {
    // resolve cohort
    let cohortId = data.cohortId;
    if (cohortId) {
      const cohort = await this.prisma.cohort.findUnique({ where: { id: cohortId } });
      if (!cohort || cohort.programId !== programId) throw new BadRequestException('Invalid cohortId for this program');
    } else {
      const defaultCohort = await this.prisma.cohort.findFirst({ where: { programId }, orderBy: { createdAt: 'desc' } });
      if (!defaultCohort) throw new BadRequestException('No cohort found for this program; provide cohortId');
      cohortId = defaultCohort.id;
    }
    return this.prisma.enrollment.create({ data: { studentId: data.studentId, cohortId, status: data.status ?? undefined } });
  }

  async updateEnrollmentForProgram(programId: string, enrollmentId: string, data: any) {
    const enrollment = await this.getEnrollmentForProgram(programId, enrollmentId);
    const update: any = {};
    if (data.status) update.status = data.status;
    if (data.cohortId) {
      const newCohort = await this.prisma.cohort.findUnique({ where: { id: data.cohortId } });
      if (!newCohort || newCohort.programId !== programId) throw new BadRequestException('Invalid cohortId for this program');
      update.cohortId = data.cohortId;
    }
    return this.prisma.enrollment.update({ where: { id: enrollmentId }, data: update });
  }

  async removeEnrollmentForProgram(programId: string, enrollmentId: string) {
    const enrollment = await this.getEnrollmentForProgram(programId, enrollmentId);
    return this.prisma.enrollment.delete({ where: { id: enrollment.id } });
  }

  // Cohorts
  async createCohort(data: CreateCohortDto) {
  const payload: any = {
    name: data.name,
    programId: data.programId,
    intakeYear: data.intakeYear,
  };
  return this.prisma.cohort.create({ data: payload });
  }

  // Enrollment
  async enrollStudent(data: { studentId: string; cohortId: string; status?: string }) {
  const payload: any = {
    studentId: data.studentId,
    cohortId: data.cohortId,
    status: data.status ?? undefined,
  };
  return this.prisma.enrollment.create({ data: payload });
  }

  // Assignments & submissions
  async createAssignment(data: CreateAssignmentDto) {
  const payload: any = {
    title: data.title,
    description: data.description,
    courseId: data.courseId,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    totalMarks: data.totalMarks,
  };
  return this.prisma.assignment.create({ data: payload });
  }

  async submitAssignment(data: SubmitAssignmentDto) {
  const payload: any = {
    assignmentId: data.assignmentId,
    studentId: data.studentId,
    submissionText: data.submissionText,
  };
  return this.prisma.assignmentSubmission.create({ data: payload });
  }

  // Exams & results
  async createExam(data: CreateExamDto) {
  const payload: any = {
    title: data.title,
    courseId: data.courseId,
    examDate: new Date(data.examDate),
    durationMin: data.durationMin,
    totalMarks: data.totalMarks,
    examType: data.examType,
  };
  return this.prisma.exam.create({ data: payload });
  }

  async recordExamResult(data: CreateMarkDto) {
  const payload: any = {
    examId: data.examId,
    studentId: data.studentId,
    marks: data.marks,
    grade: data.grade,
    remarks: data.remarks,
  };
  return this.prisma.examResult.create({ data: payload });
  }

  // Attendance
  async recordAttendance(data: { studentId: string; date: Date; status: string; courseId?: string; cohortId?: string; recordedById?: string; remarks?: string }) {
  const payload: any = {
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

  // Find student by studentNumber (includes enrollments)
  async findStudentByStudentNumber(studentNumber: string) {
    const user = await (this.prisma.user as any).findUnique({ where: { studentNumber }, include: { enrollments: { include: { cohort: true } } } });
    if (!user) throw new NotFoundException('Student not found');
    return user;
  }
}