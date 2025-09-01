import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
}