import { Controller, Get, Query, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('academics')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Post('departments')
  @ApiOperation({ summary: 'Create department' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academicsService.createDepartment(dto as any);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  getDepartments() {
    return this.academicsService.getDepartments();
  }

  @Post('programs')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createProgram(@Body() dto: CreateProgramDto) {
    return this.academicsService.createProgram(dto as any);
  }

  @Get('programs')
  getPrograms() {
    return this.academicsService.getPrograms();
  }

  @Post('courses')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createCourse(@Body() dto: CreateCourseDto) {
    return this.academicsService.createCourse(dto as any);
  }

  @Get('courses')
  @ApiQuery({ name: 'programId', required: false })
  getCourses(@Query('programId') programId?: string) {
    return this.academicsService.getCourses({ programId });
  }

  @Post('cohorts')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  createCohort(@Body() dto: CreateCohortDto) {
    return this.academicsService.createCohort(dto as any);
  }

  @Post('enroll')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  enrollStudent(@Body() data: any) {
    return this.academicsService.enrollStudent(data);
  }

  @Post('assignments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACULTY)
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.academicsService.createAssignment(dto as any);
  }

  @Post('assignments/submit')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  submitAssignment(@Body() data: any) {
    return this.academicsService.submitAssignment(data);
  }

  @Post('exams')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACULTY)
  createExam(@Body() dto: CreateExamDto) {
    return this.academicsService.createExam(dto as any);
  }

  @Post('exams/record')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACULTY)
  recordExamResult(@Body() dto: CreateMarkDto) {
    return this.academicsService.recordExamResult(dto as any);
  }

  @Post('attendance')
  @UseGuards(RolesGuard)
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  recordAttendance(@Body() data: any) {
    return this.academicsService.recordAttendance(data);
  }
}