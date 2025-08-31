import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';

@ApiTags('academics')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Post('departments')
  @ApiOperation({ summary: 'Create department' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academicsService.createDepartment(dto as any);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  getDepartments() {
    return this.academicsService.getDepartments();
  }

  @Post('programs')
  createProgram(@Body() dto: CreateProgramDto) {
    return this.academicsService.createProgram(dto as any);
  }

  @Get('programs')
  getPrograms() {
    return this.academicsService.getPrograms();
  }

  @Post('courses')
  createCourse(@Body() dto: CreateCourseDto) {
    return this.academicsService.createCourse(dto as any);
  }

  @Get('courses')
  @ApiQuery({ name: 'programId', required: false })
  getCourses(@Query('programId') programId?: string) {
    return this.academicsService.getCourses({ programId });
  }

  @Post('cohorts')
  createCohort(@Body() dto: CreateCohortDto) {
    return this.academicsService.createCohort(dto as any);
  }

  @Post('enroll')
  enrollStudent(@Body() data: any) {
    return this.academicsService.enrollStudent(data);
  }

  @Post('assignments')
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.academicsService.createAssignment(dto as any);
  }

  @Post('assignments/submit')
  submitAssignment(@Body() data: any) {
    return this.academicsService.submitAssignment(data);
  }

  @Post('exams')
  createExam(@Body() dto: CreateExamDto) {
    return this.academicsService.createExam(dto as any);
  }

  @Post('exams/record')
  recordExamResult(@Body() dto: CreateMarkDto) {
    return this.academicsService.recordExamResult(dto as any);
  }

  @Post('attendance')
  recordAttendance(@Body() data: any) {
    return this.academicsService.recordAttendance(data);
  }
}