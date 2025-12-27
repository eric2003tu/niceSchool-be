import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentStatus } from '@prisma/client';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { RegisterStudentInProgramDto } from './dto/register-student-program.dto';

@Injectable()
export class AcademicsService {
      /**
       * Get a single course by id
       */
      async getCourse(id: string) {
        const course = await this.prisma.course.findUnique({
          where: { id },
          include: { department: true, programs: true, instructors: true },
        });
        if (!course) throw new NotFoundException('Course not found');
        return course;
      }
    /**
     * Get one student who has been admitted, registered, and enrolled by studentId
     */
    async getAdmittedRegisteredEnrolledStudent(studentId: string): Promise<any> {
      return this.prisma.student.findFirst({
        where: {
          id: studentId,
          program: {
            applications: {
              some: {
                status: 'ADMITTED',
              },
            },
          },
          enrollments: {
            some: {
              status: 'REGISTERED',
            },
          },
        },
        include: {
          profile: true,
          program: true,
          enrollments: {
            include: {
              course: true,
            },
          },
          cohort: true,
        },
      });
    }
  constructor(private prisma: PrismaService) {}

    /**
     * Get students who have been admitted, registered, and enrolled
     */
    async getAdmittedRegisteredEnrolledStudents(): Promise<any[]> {
      // Find students with admitted application, registered status, and enrollment
      // Assumes 'ADMITTED' status in application, 'REGISTERED' status in enrollment
      return this.prisma.student.findMany({
        where: {
          program: {
            applications: {
              some: {
                status: 'ADMITTED',
              },
            },
          },
          enrollments: {
            some: {
              status: 'REGISTERED',
            },
          },
        },
        include: {
          profile: true,
          program: true,
          enrollments: {
            include: {
              course: true,
            },
          },
          cohort: true,
        },
      });
    }

  // Departments
  async createDepartment(data: CreateDepartmentDto) {
    const payload: any = {
      name: data.name,
      code: data.code,
      description: data.description,
    };
    
    if (data.headId) {
      const head = await this.prisma.faculty.findUnique({
        where: { id: data.headId },
      });
      if (!head) throw new BadRequestException('Invalid headId: faculty not found');
      payload.headId = data.headId;
    }
    
    return this.prisma.department.create({ data: payload });
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      include: { programs: true, courses: true, head: true },
    });
  }

  async getDepartment(id: string) {
    const dep = await this.prisma.department.findUnique({
      where: { id },
      include: { programs: true, courses: true, head: true },
    });
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

  async getPrograms() {
    return this.prisma.program.findMany({
      include: { department: true, cohorts: true, courses: true },
    });
  }

  async getProgram(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: { department: true, cohorts: true, courses: true },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  // Courses
  async createCourse(data: CreateCourseDto) {
    const payload: any = {
      title: data.title,
      code: data.code,
      credits: data.credits,
      description: data.description,
      departmentId: data.departmentId,
    };
    if (data.programId) {
      payload.programs = {
        connect: [{ id: data.programId }],
      };
    }
    return this.prisma.course.create({ data: payload });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: { department: true, programs: true, instructors: true },
    });
  }

  // Register student in program from application
  async registerStudentInProgram(dto: RegisterStudentInProgramDto) {
    // Find admitted application - Applications don't have email field in your schema
    // They have applicant relation instead
    const applicantAccount = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });
    
    if (!applicantAccount) {
      throw new NotFoundException('Account not found with this email');
    }
    
    const admittedApplication = await this.prisma.application.findFirst({
      where: {
        applicantId: applicantAccount.id,
        status: 'ADMITTED',
      },
    });
    
    if (!admittedApplication) {
      throw new NotFoundException('No admitted application found for this student. Registration not allowed.');
    }

    // Find the student profile through account
    const profile = await this.prisma.profile.findUnique({
      where: { accountId: applicantAccount.id },
    });
    
    if (!profile) throw new NotFoundException('Student profile not found');
    
    // Find or create the student entity
    let student = await this.prisma.student.findFirst({
      where: { profileId: profile.id },
    });
    
    if (!student) {
      // Find program by code
      const program = await this.prisma.program.findUnique({
        where: { code: dto.programCode },
      });
      
      if (!program) throw new NotFoundException('Program not found');
      
      // Generate student number
      const generateStudentNumber = async (): Promise<string> => {
        const num = Math.floor(100000 + Math.random() * 900000).toString();
        const exists = await this.prisma.student.findUnique({
          where: { studentNumber: num },
        });
        if (exists) return generateStudentNumber();
        return num;
      };
      
      const studentNumber = await generateStudentNumber();
      
      // Create student
      student = await this.prisma.student.create({
        data: {
          profileId: profile.id,
          studentNumber: studentNumber,
          enrollmentDate: new Date(),
          programId: program.id, // Required by schema
        },
      });
    }
    
    // Find the program by code
    const program = await this.prisma.program.findUnique({
      where: { code: dto.programCode },
    });
    
    if (!program) throw new NotFoundException('Program not found');
    
    // Find the cohort by code and program
    const cohort = await this.prisma.cohort.findFirst({
      where: { 
        code: dto.cohortCode,
        programId: program.id,
      },
    });
    
    if (!cohort) throw new NotFoundException('Cohort not found for this program');
    
    // Find a course in the program to enroll in (required by schema)
    const programCourse = await this.prisma.course.findFirst({
      where: {
        programs: {
          some: { id: program.id }
        }
      }
    });
    
    if (!programCourse) {
      throw new BadRequestException('No courses available in this program to enroll in');
    }
    
    // Check if already enrolled in this course for the current semester
    const semester = '2024-FALL'; // You might want to make this dynamic
    const existing = await this.prisma.enrollment.findFirst({
      where: { 
        studentId: student.id,
        courseId: programCourse.id,
        semester: semester,
      },
    });
    
    if (existing) {
      return {
        message: 'Student already enrolled in this course for this semester',
        enrollment: existing,
      };
    }
    
    // Create the enrollment (Enrollment connects to Course, not Cohort in your schema)
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: programCourse.id,
        semester: semester,
        status: 'REGISTERED',
        enrolledAt: new Date(),
      },
    });
    
    return {
      message: 'Student registered and enrolled successfully',
      enrollment,
      student,
    };
  }

  async addStudentToProgram(programId: string, data: { studentId: string; cohortId?: string }) {
    // Check if student exists
    const student = await this.prisma.student.findUnique({
      where: { id: data.studentId },
    });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    // Find a course in the program to enroll in
    const programCourse = await this.prisma.course.findFirst({
      where: {
        programs: {
          some: { id: programId }
        }
      }
    });
    
    if (!programCourse) {
      throw new BadRequestException('No courses available in this program to enroll in');
    }
    
    // Check for existing enrollment
    const semester = '2024-FALL'; // Dynamic semester
    const existing = await this.prisma.enrollment.findFirst({
      where: {
        studentId: data.studentId,
        courseId: programCourse.id,
        semester: semester,
      },
    });
    
    if (existing) {
      throw new BadRequestException('Student already enrolled in this course for this semester');
    }
    
    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: programCourse.id,
        semester: semester,
        status: 'REGISTERED',
        enrolledAt: new Date(),
      },
    });
    
    return enrollment;
  }

  async createStudentAndEnroll(programId: string, data: { 
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    email: string;
    cohortId?: string;
  }) {
    // Check if program exists
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });
    
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Generate unique 6-digit student number
    const generateStudentNumber = async (): Promise<string> => {
      const num = Math.floor(100000 + Math.random() * 900000).toString();
      const exists = await this.prisma.student.findUnique({
        where: { studentNumber: num },
      });
      if (exists) return generateStudentNumber();
      return num;
    };

    const studentNumber = await generateStudentNumber();

    // Create user account with a default password
    const tmpPassword = Math.random().toString(36).slice(-8) + 'A1!';
    const hashed = await bcrypt.hash(tmpPassword, 10);

    // Create account (no password field in Account model - it's passwordHash)
    const email = data.email;
    
    const account = await this.prisma.account.create({
      data: {
        email,
        passwordHash: hashed,
        role: 'STUDENT',
      },
    });

    // Create profile
    const profile = await this.prisma.profile.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        accountId: account.id,
      },
    });

    // Create student (programId is required)
    const student = await this.prisma.student.create({
      data: {
        profileId: profile.id,
        studentNumber: studentNumber,
        enrollmentDate: new Date(),
        programId: programId, // Required by schema
        cohortId: data.cohortId, // Optional
      },
    });

    // Find a course to enroll in
    const programCourse = await this.prisma.course.findFirst({
      where: {
        programs: {
          some: { id: programId }
        }
      }
    });
    
    let enrollment = null;
    if (programCourse) {
      // Create enrollment
      enrollment = await this.prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: programCourse.id,
          semester: '2024-FALL',
          status: 'REGISTERED',
          enrolledAt: new Date(),
        },
      });
    }

    return {
      student,
      enrollment,
      account: {
        email: account.email,
        temporaryPassword: tmpPassword,
      },
    };
  }

  async getTeachersForProgram(programId: string) {
    const courses = await this.prisma.course.findMany({
      where: { 
        programs: { 
          some: { id: programId } 
        } 
      },
      select: { id: true },
    });
    
    const courseIds = courses.map(c => c.id);
    if (courseIds.length === 0) return [];
    
    // Get faculties teaching these courses
    return this.prisma.faculty.findMany({
      where: { 
        courses: { 
          some: { id: { in: courseIds } } 
        } 
      },
      include: { profile: true },
    });
  }

  async addTeacherToProgram(programId: string, facultyId: string) {
    const courses = await this.prisma.course.findMany({
      where: { 
        programs: { 
          some: { id: programId } 
        } 
      },
      select: { id: true },
    });
    
    if (courses.length === 0) {
      throw new BadRequestException('No courses found for this program');
    }
    
    const ops = courses.map(c => 
      this.prisma.course.update({
        where: { id: c.id },
        data: { 
          instructors: { 
            connect: { id: facultyId } 
          } 
        },
      })
    );
    
    return this.prisma.$transaction(ops);
  }

  async getEnrollmentsForProgram(programId: string) {
    // Get courses in the program
    const courses = await this.prisma.course.findMany({
      where: {
        programs: {
          some: { id: programId }
        }
      },
      select: { id: true },
    });
    
    const courseIds = courses.map(c => c.id);
    if (courseIds.length === 0) return [];
    
    // Get enrollments for these courses
    return this.prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: { 
        student: {
          include: { profile: true }
        },
        course: true,
      },
    });
  }

  async getEnrollmentForProgram(programId: string, enrollmentId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { 
        student: {
          include: { profile: true }
        },
        course: true,
      },
    });
    
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    
    // Verify the course belongs to the program
    const courseInProgram = await this.prisma.course.findFirst({
      where: {
        id: enrollment.courseId,
        programs: {
          some: { id: programId }
        }
      }
    });
    
    if (!courseInProgram) {
      throw new BadRequestException('Enrollment does not belong to this program');
    }
    
    return enrollment;
  }

  async createEnrollmentForProgram(programId: string, data: { 
    studentId: string; 
    cohortId?: string; 
    status?: string;
  }) {
    // Verify student exists
    const student = await this.prisma.student.findUnique({
      where: { id: data.studentId },
    });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    
    // Find a course in the program
    const programCourse = await this.prisma.course.findFirst({
      where: {
        programs: {
          some: { id: programId }
        }
      }
    });
    
    if (!programCourse) {
      throw new BadRequestException('No courses found in this program');
    }
    
    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: programCourse.id,
        semester: '2024-FALL', // Make this dynamic
        status: (data.status as EnrollmentStatus) || EnrollmentStatus.REGISTERED,
        enrolledAt: new Date(),
      },
    });
    
    return enrollment;
  }

  async updateEnrollmentForProgram(programId: string, enrollmentId: string, data: any) {
    await this.getEnrollmentForProgram(programId, enrollmentId);
    
    const update: any = {};
    if (data.status) update.status = data.status;
    if (data.semester) update.semester = data.semester;
    if (data.finalGrade !== undefined) update.finalGrade = data.finalGrade;
    if (data.gradePoints !== undefined) update.gradePoints = data.gradePoints;
    
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: update,
    });
  }

  async removeEnrollmentForProgram(programId: string, enrollmentId: string) {
    await this.getEnrollmentForProgram(programId, enrollmentId);
    
    return this.prisma.enrollment.delete({
      where: { id: enrollmentId },
    });
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

  async getCohorts(programId?: string) {
    const where = programId ? { programId } : {};
    
    return this.prisma.cohort.findMany({
      where,
      include: { program: true, students: true },
    });
  }

  async getCohortsByProgram(programId: string) {
    return this.getCohorts(programId);
  }

  // Enrollment - simplified version matching your schema
  async enrollStudent(data: { 
    studentId: string; 
    courseId: string;
    semester: string;
    status?: string;
  }) {
    const payload: any = {
      studentId: data.studentId,
      courseId: data.courseId,
      semester: data.semester,
      status: data.status as EnrollmentStatus || EnrollmentStatus.REGISTERED,
      enrolledAt: new Date(),
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
      totalPoints: data.totalMarks,
    };
    const faculty = await this.prisma.faculty.findFirst();
    if (faculty) {
      payload.facultyCreatorId = faculty.id;
    }
    return this.prisma.assignment.create({ data: payload });
  }

  async submitAssignment(data: SubmitAssignmentDto) {
    const payload: any = {
      assignmentId: data.assignmentId,
      studentId: data.studentId,
      content: data.submissionText,
      submittedAt: new Date(),
      status: 'SUBMITTED',
    };
    return this.prisma.assignmentSubmission.create({ data: payload });
  }

  // Exams & results
  async createExam(data: CreateExamDto) {
    const payload: any = {
      title: data.title,
      courseId: data.courseId,
      examDate: new Date(data.examDate),
      duration: data.durationMin,
      totalPoints: data.totalMarks,
      examType: data.examType,
    };
    const faculty = await this.prisma.faculty.findFirst();
    if (faculty) {
      payload.facultyCreatorId = faculty.id;
    }
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
  async recordAttendance(data: { 
    studentId: string; 
    date: Date; 
    status: string;
    enrollmentId: string;
    courseId?: string; 
    cohortId?: string; 
    recordedById?: string; 
    remarks?: string;
  }) {
    const payload: any = {
      studentId: data.studentId,
      enrollmentId: data.enrollmentId,
      date: data.date,
      status: data.status,
      remarks: data.remarks,
    };
    
    if (data.courseId) {
      payload.courseId = data.courseId;
    }
    
    if (data.cohortId) {
      payload.cohortId = data.cohortId;
    }
    
    if (data.recordedById) {
      payload.recordedById = data.recordedById;
    }
    
    return this.prisma.attendance.create({ data: payload });
  }

  // Find student by studentNumber
  async findStudentByStudentNumber(studentNumber: string) {
    const student = await this.prisma.student.findUnique({
      where: { studentNumber },
      include: { 
        profile: {
          include: { account: true }
        },
        enrollments: { 
          include: { 
            course: {
              include: { programs: true }
            }
          }
        },
        program: true,
        cohort: true,
      },
    });
    
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  // Get students for a program
  async getStudentsForProgram(programId: string) {
    return this.prisma.student.findMany({
      where: { programId },
      include: { 
        profile: {
          include: { account: true }
        },
        enrollments: {
          include: { course: true }
        },
        cohort: true,
      },
    });
  }

  // Get courses for a program
  async getCoursesByProgram(programId: string) {
    return this.prisma.course.findMany({
      where: {
        programs: {
          some: { id: programId }
        }
      },
      include: { 
        instructors: {
          include: { profile: true }
        },
        department: true,
        programs: true,
      },
    });
  }
}