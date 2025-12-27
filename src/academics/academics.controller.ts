import { RegisterStudentInProgramDto } from './dto/register-student-program.dto';
import { Controller, Get, Query, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateStudentAndEnrollDto } from './dto/create-student-enroll.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('academics')
@Controller('academics')
export class AcademicsController {
        @Get('all-cohorts')
        @ApiOperation({ summary: 'Get all cohorts in the system (no program or department filter)' })
        getAllCohorts() {
          return this.academicsService.getAllCohorts();
        }
      @Get('courses/:id')
      @ApiOperation({ summary: 'Get a single course by id' })
      getCourse(@Param('id') id: string) {
        return this.academicsService.getCourse(id);
      }
    @Get('students/admitted-registered-enrolled/:studentId')
    @ApiOperation({ summary: 'Get one admitted, registered, and enrolled student by ID' })
    getAdmittedRegisteredEnrolledStudent(@Param('studentId') studentId: string) {
      return this.academicsService.getAdmittedRegisteredEnrolledStudent(studentId);
    }
  constructor(private readonly academicsService: AcademicsService) {}

    @Get('students/admitted-registered-enrolled')
    @ApiOperation({ summary: 'Get students who are admitted, registered, and enrolled' })
    getAdmittedRegisteredEnrolledStudents() {
      return this.academicsService.getAdmittedRegisteredEnrolledStudents();
    }

  @Post('register')
  @ApiOperation({ summary: 'Register a student in their admitted program (creates enrollment)' })
  registerStudentInProgram(@Body() dto: RegisterStudentInProgramDto) {
    return this.academicsService.registerStudentInProgram(dto);
  }

    @Get('all-courses')
  @ApiOperation({ summary: 'Get all courses in the system (no program or department filter)' })
  getAllCourses() {
    return this.academicsService.getAllCourses();
  }
  
  @Get('programs/:id')
  @ApiOperation({ summary: 'Get a single program by id' })
  getProgram(@Param('id') id: string) {
    return this.academicsService.getProgram(id);
  }

  @Get('departments/:id')
  @ApiOperation({ summary: 'Get one department by id' })
  getDepartment(@Param('id') id: string) {
    return this.academicsService.getDepartment(id);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create department' })
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createProgram(@Body() dto: CreateProgramDto) {
    return this.academicsService.createProgram(dto as any);
  }


  @Get('programs')
  @ApiQuery({ name: 'departmentId', required: false })
  getPrograms(@Query('departmentId') departmentId?: string) {
    if (departmentId) {
      return this.academicsService.getPrograms().then(programs => programs.filter(p => p.departmentId === departmentId));
    }
    return this.academicsService.getPrograms();
  }


  @Get('all-programs')
  @ApiOperation({ summary: 'Get all programs in the system (no department filter)' })
  getAllPrograms() {
    return this.academicsService.getPrograms();
  }
  @Get('departments/:id/programs')
  @ApiOperation({ summary: 'Get programs for a specific department' })
  getProgramsByDepartment(@Param('id') id: string) {
    return this.academicsService.getPrograms().then(programs => programs.filter(p => p.departmentId === id));
  }


  @Get('programs/:id/courses')
  @ApiOperation({ summary: 'Get courses for a specific program' })
  getCoursesByProgram(@Param('id') id: string) {
    return this.academicsService.getCoursesByProgram(id);
  }


  @Get('programs/:id/cohorts')
  @ApiOperation({ summary: 'Get cohorts for a specific program' })
  getCohortsByProgram(@Param('id') id: string) {
    return this.academicsService.getCohortsByProgram(id);
  }

  @Get('programs/:id/students')
  @ApiOperation({ summary: 'Get students enrolled in a specific program' })
  getStudentsByProgram(@Param('id') id: string) {
    return this.academicsService.getStudentsForProgram(id);
  }

  @Post('programs/:id/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiOperation({ summary: 'Enroll a student into a program (specify cohortId optional)' })
  enrollStudentToProgram(@Param('id') id: string, @Body() data: { studentId: string; cohortId?: string }) {
    return this.academicsService.addStudentToProgram(id, data as any);
  }

  @Post('programs/:id/students/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiOperation({ summary: 'Create a new student user and enroll into a program (returns studentNumber and temporary password)' })
  createStudentAndEnroll(@Param('id') id: string, @Body() dto: CreateStudentAndEnrollDto) {
    return this.academicsService.createStudentAndEnroll(id, dto as any);
  }

  @Get('students/by-number/:studentNumber')
  @ApiOperation({ summary: 'Find a student by student number with enrollments' })
  findStudentByNumber(@Param('studentNumber') studentNumber: string) {
    return this.academicsService.findStudentByStudentNumber(studentNumber);
  }

  @Get('programs/:id/teachers')
  @ApiOperation({ summary: 'Get teachers assigned to a specific program' })
  getTeachersByProgram(@Param('id') id: string) {
    return this.academicsService.getTeachersForProgram(id);
  }

  @Post('programs/:id/teachers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign a teacher to all courses in a program' })
  addTeacherToProgram(@Param('id') id: string, @Body() data: { facultyId: string }) {
    return this.academicsService.addTeacherToProgram(id, data.facultyId);
  }

  @Get('programs/:id/enrollments')
  @ApiOperation({ summary: 'Get enrollments for a specific program' })
  getEnrollmentsByProgram(@Param('id') id: string) {
    return this.academicsService.getEnrollmentsForProgram(id);
  }

  @Get('programs/:id/enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Get a specific enrollment for a program' })
  getEnrollmentByProgram(@Param('id') id: string, @Param('enrollmentId') enrollmentId: string) {
    return this.academicsService.getEnrollmentForProgram(id, enrollmentId);
  }

  @Post('programs/:id/enrollments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiOperation({ summary: 'Create (enroll) an enrollment for a program' })
  createEnrollmentForProgram(@Param('id') id: string, @Body() data: { studentId: string; cohortId?: string; status?: string }) {
    return this.academicsService.createEnrollmentForProgram(id, data as any);
  }

  @Patch('programs/:id/enrollments/:enrollmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiOperation({ summary: 'Update an enrollment for a program' })
  updateEnrollmentForProgram(@Param('id') id: string, @Param('enrollmentId') enrollmentId: string, @Body() data: any) {
    return this.academicsService.updateEnrollmentForProgram(id, enrollmentId, data);
  }

  @Delete('programs/:id/enrollments/:enrollmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an enrollment for a program' })
  removeEnrollmentForProgram(@Param('id') id: string, @Param('enrollmentId') enrollmentId: string) {
    return this.academicsService.removeEnrollmentForProgram(id, enrollmentId);
  }

  @Post('courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createCourse(@Body() dto: CreateCourseDto) {
    return this.academicsService.createCourse(dto as any);
  }


  @Get('courses')
  @ApiQuery({ name: 'programId', required: false })
  getCourses(@Query('programId') programId?: string) {
    if (programId) {
      return this.academicsService.getCoursesByProgram(programId);
    }
    return this.academicsService.getAllCourses();
  }

  @Post('cohorts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createCohort(@Body() dto: CreateCohortDto) {
    return this.academicsService.createCohort(dto as any);
  }

  @Post('enroll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  enrollStudent(@Body() data: any) {
    return this.academicsService.enrollStudent(data);
  }

  @Post('assignments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACULTY)
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.academicsService.createAssignment(dto as any);
  }

  @Post('assignments/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  submitAssignment(@Body() data: any) {
    return this.academicsService.submitAssignment(data);
  }

  @Post('exams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACULTY)
  createExam(@Body() dto: CreateExamDto) {
    return this.academicsService.createExam(dto as any);
  }

  @Post('exams/record')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACULTY)
  recordExamResult(@Body() dto: CreateMarkDto) {
    return this.academicsService.recordExamResult(dto as any);
  }

  @Post('attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACULTY, UserRole.ADMIN)
  recordAttendance(@Body() data: any) {
    return this.academicsService.recordAttendance(data);
  }
}