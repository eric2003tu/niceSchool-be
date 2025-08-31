import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  // Departments
  async createDepartment(data: any) {
    return this.prisma.department.create({ data });
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
  async createProgram(data: any) {
    return this.prisma.program.create({ data });
  }

  async getPrograms() {
    return this.prisma.program.findMany({ include: { courses: true, cohorts: true } });
  }

  // Courses
  async createCourse(data: any) {
    return this.prisma.course.create({ data });
  }

  async getCourses(filter?: any) {
    const where = filter?.programId ? { programId: filter.programId } : undefined;
    return this.prisma.course.findMany({ where, include: { instructors: true, assignments: true, exams: true } });
  }

  // Cohorts
  async createCohort(data: any) {
    return this.prisma.cohort.create({ data });
  }

  // Enrollment
  async enrollStudent(data: any) {
    return this.prisma.enrollment.create({ data });
  }

  // Assignments & submissions
  async createAssignment(data: any) {
    return this.prisma.assignment.create({ data });
  }

  async submitAssignment(data: any) {
    return this.prisma.assignmentSubmission.create({ data });
  }

  // Exams & results
  async createExam(data: any) {
    return this.prisma.exam.create({ data });
  }

  async recordExamResult(data: any) {
    return this.prisma.examResult.create({ data });
  }

  // Attendance
  async recordAttendance(data: any) {
    return this.prisma.attendance.create({ data });
  }
}