"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AcademicsService = class AcademicsService {
    async getAllCohorts() {
        return this.prisma.cohort.findMany({
            include: { program: true, students: true },
        });
    }
    async getCourse(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: { department: true, programs: true, instructors: true },
        });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async getAdmittedRegisteredEnrolledStudent(studentId) {
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdmittedRegisteredEnrolledStudents() {
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
    async createDepartment(data) {
        const payload = {
            name: data.name,
            code: data.code,
            description: data.description,
        };
        if (data.headId) {
            const head = await this.prisma.faculty.findUnique({
                where: { id: data.headId },
            });
            if (!head)
                throw new common_1.BadRequestException('Invalid headId: faculty not found');
            payload.headId = data.headId;
        }
        return this.prisma.department.create({ data: payload });
    }
    async getDepartments() {
        return this.prisma.department.findMany({
            include: { programs: true, courses: true, head: true },
        });
    }
    async getDepartment(id) {
        const dep = await this.prisma.department.findUnique({
            where: { id },
            include: { programs: true, courses: true, head: true },
        });
        if (!dep)
            throw new common_1.NotFoundException('Department not found');
        return dep;
    }
    async createProgram(data) {
        const payload = {
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
    async getProgram(id) {
        const program = await this.prisma.program.findUnique({
            where: { id },
            include: { department: true, cohorts: true, courses: true },
        });
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        return program;
    }
    async createCourse(data) {
        const payload = {
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
    async registerStudentInProgram(dto) {
        const applicantAccount = await this.prisma.account.findUnique({
            where: { email: dto.email },
        });
        if (!applicantAccount) {
            throw new common_1.NotFoundException('Account not found with this email');
        }
        const admittedApplication = await this.prisma.application.findFirst({
            where: {
                applicantId: applicantAccount.id,
                status: 'ADMITTED',
            },
        });
        if (!admittedApplication) {
            throw new common_1.NotFoundException('No admitted application found for this student. Registration not allowed.');
        }
        const profile = await this.prisma.profile.findUnique({
            where: { accountId: applicantAccount.id },
        });
        if (!profile)
            throw new common_1.NotFoundException('Student profile not found');
        let student = await this.prisma.student.findFirst({
            where: { profileId: profile.id },
        });
        if (!student) {
            const program = await this.prisma.program.findUnique({
                where: { code: dto.programCode },
            });
            if (!program)
                throw new common_1.NotFoundException('Program not found');
            const generateStudentNumber = async () => {
                const num = Math.floor(100000 + Math.random() * 900000).toString();
                const exists = await this.prisma.student.findUnique({
                    where: { studentNumber: num },
                });
                if (exists)
                    return generateStudentNumber();
                return num;
            };
            const studentNumber = await generateStudentNumber();
            student = await this.prisma.student.create({
                data: {
                    profileId: profile.id,
                    studentNumber: studentNumber,
                    enrollmentDate: new Date(),
                    programId: program.id,
                },
            });
        }
        const program = await this.prisma.program.findUnique({
            where: { code: dto.programCode },
        });
        if (!program)
            throw new common_1.NotFoundException('Program not found');
        const cohort = await this.prisma.cohort.findFirst({
            where: {
                code: dto.cohortCode,
                programId: program.id,
            },
        });
        if (!cohort)
            throw new common_1.NotFoundException('Cohort not found for this program');
        const programCourse = await this.prisma.course.findFirst({
            where: {
                programs: {
                    some: { id: program.id }
                }
            }
        });
        if (!programCourse) {
            throw new common_1.BadRequestException('No courses available in this program to enroll in');
        }
        const semester = '2024-FALL';
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
    async addStudentToProgram(programId, data) {
        const student = await this.prisma.student.findUnique({
            where: { id: data.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const programCourse = await this.prisma.course.findFirst({
            where: {
                programs: {
                    some: { id: programId }
                }
            }
        });
        if (!programCourse) {
            throw new common_1.BadRequestException('No courses available in this program to enroll in');
        }
        const semester = '2024-FALL';
        const existing = await this.prisma.enrollment.findFirst({
            where: {
                studentId: data.studentId,
                courseId: programCourse.id,
                semester: semester,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Student already enrolled in this course for this semester');
        }
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
    async createStudentAndEnroll(programId, data) {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
        });
        if (!program) {
            throw new common_1.NotFoundException('Program not found');
        }
        const generateStudentNumber = async () => {
            const num = Math.floor(100000 + Math.random() * 900000).toString();
            const exists = await this.prisma.student.findUnique({
                where: { studentNumber: num },
            });
            if (exists)
                return generateStudentNumber();
            return num;
        };
        const studentNumber = await generateStudentNumber();
        const tmpPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const hashed = await bcrypt.hash(tmpPassword, 10);
        const email = data.email;
        const account = await this.prisma.account.create({
            data: {
                email,
                passwordHash: hashed,
                role: 'STUDENT',
            },
        });
        const profile = await this.prisma.profile.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                accountId: account.id,
            },
        });
        const student = await this.prisma.student.create({
            data: {
                profileId: profile.id,
                studentNumber: studentNumber,
                enrollmentDate: new Date(),
                programId: programId,
                cohortId: data.cohortId,
            },
        });
        const programCourse = await this.prisma.course.findFirst({
            where: {
                programs: {
                    some: { id: programId }
                }
            }
        });
        let enrollment = null;
        if (programCourse) {
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
    async getTeachersForProgram(programId) {
        const courses = await this.prisma.course.findMany({
            where: {
                programs: {
                    some: { id: programId }
                }
            },
            select: { id: true },
        });
        const courseIds = courses.map(c => c.id);
        if (courseIds.length === 0)
            return [];
        return this.prisma.faculty.findMany({
            where: {
                courses: {
                    some: { id: { in: courseIds } }
                }
            },
            include: { profile: true },
        });
    }
    async addTeacherToProgram(programId, facultyId) {
        const courses = await this.prisma.course.findMany({
            where: {
                programs: {
                    some: { id: programId }
                }
            },
            select: { id: true },
        });
        if (courses.length === 0) {
            throw new common_1.BadRequestException('No courses found for this program');
        }
        const ops = courses.map(c => this.prisma.course.update({
            where: { id: c.id },
            data: {
                instructors: {
                    connect: { id: facultyId }
                }
            },
        }));
        return this.prisma.$transaction(ops);
    }
    async getEnrollmentsForProgram(programId) {
        const courses = await this.prisma.course.findMany({
            where: {
                programs: {
                    some: { id: programId }
                }
            },
            select: { id: true },
        });
        const courseIds = courses.map(c => c.id);
        if (courseIds.length === 0)
            return [];
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
    async getEnrollmentForProgram(programId, enrollmentId) {
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
            throw new common_1.NotFoundException('Enrollment not found');
        }
        const courseInProgram = await this.prisma.course.findFirst({
            where: {
                id: enrollment.courseId,
                programs: {
                    some: { id: programId }
                }
            }
        });
        if (!courseInProgram) {
            throw new common_1.BadRequestException('Enrollment does not belong to this program');
        }
        return enrollment;
    }
    async createEnrollmentForProgram(programId, data) {
        const student = await this.prisma.student.findUnique({
            where: { id: data.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const programCourse = await this.prisma.course.findFirst({
            where: {
                programs: {
                    some: { id: programId }
                }
            }
        });
        if (!programCourse) {
            throw new common_1.BadRequestException('No courses found in this program');
        }
        const enrollment = await this.prisma.enrollment.create({
            data: {
                studentId: data.studentId,
                courseId: programCourse.id,
                semester: '2024-FALL',
                status: data.status || client_1.EnrollmentStatus.REGISTERED,
                enrolledAt: new Date(),
            },
        });
        return enrollment;
    }
    async updateEnrollmentForProgram(programId, enrollmentId, data) {
        await this.getEnrollmentForProgram(programId, enrollmentId);
        const update = {};
        if (data.status)
            update.status = data.status;
        if (data.semester)
            update.semester = data.semester;
        if (data.finalGrade !== undefined)
            update.finalGrade = data.finalGrade;
        if (data.gradePoints !== undefined)
            update.gradePoints = data.gradePoints;
        return this.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: update,
        });
    }
    async removeEnrollmentForProgram(programId, enrollmentId) {
        await this.getEnrollmentForProgram(programId, enrollmentId);
        return this.prisma.enrollment.delete({
            where: { id: enrollmentId },
        });
    }
    async createCohort(data) {
        const payload = {
            name: data.name,
            programId: data.programId,
            intakeYear: data.intakeYear,
        };
        return this.prisma.cohort.create({ data: payload });
    }
    async getCohorts(programId) {
        const where = programId ? { programId } : {};
        return this.prisma.cohort.findMany({
            where,
            include: { program: true, students: true },
        });
    }
    async getCohortsByProgram(programId) {
        return this.getCohorts(programId);
    }
    async enrollStudent(data) {
        const payload = {
            studentId: data.studentId,
            courseId: data.courseId,
            semester: data.semester,
            status: data.status || client_1.EnrollmentStatus.REGISTERED,
            enrolledAt: new Date(),
        };
        return this.prisma.enrollment.create({ data: payload });
    }
    async createAssignment(data) {
        const payload = {
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
    async submitAssignment(data) {
        const payload = {
            assignmentId: data.assignmentId,
            studentId: data.studentId,
            content: data.submissionText,
            submittedAt: new Date(),
            status: 'SUBMITTED',
        };
        return this.prisma.assignmentSubmission.create({ data: payload });
    }
    async createExam(data) {
        const payload = {
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
    async recordExamResult(data) {
        const payload = {
            examId: data.examId,
            studentId: data.studentId,
            marks: data.marks,
            grade: data.grade,
            remarks: data.remarks,
        };
        return this.prisma.examResult.create({ data: payload });
    }
    async recordAttendance(data) {
        const payload = {
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
    async findStudentByStudentNumber(studentNumber) {
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
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    async getStudentsForProgram(programId) {
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
    async getCoursesByProgram(programId) {
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
};
exports.AcademicsService = AcademicsService;
exports.AcademicsService = AcademicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicsService);
//# sourceMappingURL=academics.service.js.map