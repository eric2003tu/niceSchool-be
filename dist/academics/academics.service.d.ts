import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
export declare class AcademicsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDepartment(data: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        headId: string | null;
    }>;
    getDepartments(): Promise<({
        head: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            department: string;
            firstName: string;
            lastName: string;
            email: string;
            position: string;
            bio: string | null;
            profileImage: string | null;
            phone: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
            isActive: boolean;
        } | null;
        programs: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.ProgramLevel;
            departmentId: string;
            durationYears: number;
        }[];
        courses: {
            id: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            title: string;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        headId: string | null;
    })[]>;
    getDepartment(id: string): Promise<{
        head: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            department: string;
            firstName: string;
            lastName: string;
            email: string;
            position: string;
            bio: string | null;
            profileImage: string | null;
            phone: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
            isActive: boolean;
        } | null;
        programs: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.ProgramLevel;
            departmentId: string;
            durationYears: number;
        }[];
        courses: {
            id: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            title: string;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        headId: string | null;
    }>;
    createProgram(data: CreateProgramDto): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    }>;
    getPrograms(filter?: {
        departmentId?: string;
    }): Promise<({
        courses: {
            id: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            title: string;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        cohorts: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            programId: string;
            intakeYear: number;
        }[];
    } & {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    })[]>;
    createCourse(data: CreateCourseDto): Promise<{
        id: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        title: string;
        credits: number;
        programId: string | null;
        semester: string | null;
    }>;
    getCourses(filter?: {
        programId?: string;
    }): Promise<({
        instructors: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            department: string;
            firstName: string;
            lastName: string;
            email: string;
            position: string;
            bio: string | null;
            profileImage: string | null;
            phone: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
            isActive: boolean;
        }[];
        assignments: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            courseId: string;
            postedById: string | null;
            postedAt: Date;
            dueDate: Date | null;
            totalMarks: number;
        }[];
        exams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            courseId: string;
            totalMarks: number;
            examDate: Date;
            durationMin: number;
            examType: import(".prisma/client").$Enums.ExamType;
            createdById: string | null;
            isPublished: boolean;
        }[];
    } & {
        id: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        title: string;
        credits: number;
        programId: string | null;
        semester: string | null;
    })[]>;
    getCohorts(filter?: {
        programId?: string;
    }): Promise<({
        attendances: {
            id: string;
            courseId: string | null;
            studentId: string;
            cohortId: string | null;
            date: Date;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            recordedById: string | null;
            remarks: string | null;
        }[];
        students: {
            id: string;
            studentId: string;
            cohortId: string;
            status: string;
            enrolledAt: Date;
            leftAt: Date | null;
        }[];
        timetable: {
            id: string;
            courseId: string;
            cohortId: string;
            instructorId: string | null;
            day: import(".prisma/client").$Enums.DayOfWeek;
            startTime: Date;
            endTime: Date;
            location: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string;
        intakeYear: number;
    })[]>;
    getStudentsForProgram(programId: string): Promise<any>;
    addStudentToProgram(programId: string, data: {
        studentId: string;
        cohortId?: string;
    }): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    createStudentAndEnroll(programId: string, data: {
        firstName: string;
        lastName: string;
        dateOfBirth?: string;
        age?: number;
        cohortId?: string;
    }): Promise<{
        student: any;
        enrollment: {
            id: string;
            studentId: string;
            cohortId: string;
            status: string;
            enrolledAt: Date;
            leftAt: Date | null;
        };
        temporaryPassword: string;
    }>;
    getTeachersForProgram(programId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        department: string;
        firstName: string;
        lastName: string;
        email: string;
        position: string;
        bio: string | null;
        profileImage: string | null;
        phone: string | null;
        office: string | null;
        specializations: string[];
        education: string[];
        publications: string[];
        isActive: boolean;
    }[]>;
    addTeacherToProgram(programId: string, facultyId: string): Promise<{
        id: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        title: string;
        credits: number;
        programId: string | null;
        semester: string | null;
    }[]>;
    getEnrollmentsForProgram(programId: string): Promise<({
        cohort: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            programId: string;
            intakeYear: number;
        };
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            profileImage: string | null;
            phone: string | null;
            isActive: boolean;
            password: string;
            studentNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            dateOfBirth: Date | null;
            lastLogin: Date | null;
        };
    } & {
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    })[]>;
    getEnrollmentForProgram(programId: string, enrollmentId: string): Promise<{
        cohort: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            programId: string;
            intakeYear: number;
        };
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            profileImage: string | null;
            phone: string | null;
            isActive: boolean;
            password: string;
            studentNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            dateOfBirth: Date | null;
            lastLogin: Date | null;
        };
    } & {
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    createEnrollmentForProgram(programId: string, data: {
        studentId: string;
        cohortId?: string;
        status?: string;
    }): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    updateEnrollmentForProgram(programId: string, enrollmentId: string, data: any): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    removeEnrollmentForProgram(programId: string, enrollmentId: string): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    createCohort(data: CreateCohortDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string;
        intakeYear: number;
    }>;
    enrollStudent(data: {
        studentId: string;
        cohortId: string;
        status?: string;
    }): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    createAssignment(data: CreateAssignmentDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        postedById: string | null;
        postedAt: Date;
        dueDate: Date | null;
        totalMarks: number;
    }>;
    submitAssignment(data: SubmitAssignmentDto): Promise<{
        id: string;
        studentId: string;
        submittedAt: Date;
        submissionText: string | null;
        fileUrl: string | null;
        marksAwarded: number | null;
        gradedAt: Date | null;
        feedback: string | null;
        assignmentId: string;
        gradedById: string | null;
    }>;
    createExam(data: CreateExamDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        courseId: string;
        totalMarks: number;
        examDate: Date;
        durationMin: number;
        examType: import(".prisma/client").$Enums.ExamType;
        createdById: string | null;
        isPublished: boolean;
    }>;
    recordExamResult(data: CreateMarkDto): Promise<{
        id: string;
        studentId: string;
        remarks: string | null;
        marks: number;
        grade: string | null;
        recordedAt: Date;
        examId: string;
    }>;
    recordAttendance(data: {
        studentId: string;
        date: Date;
        status: string;
        courseId?: string;
        cohortId?: string;
        recordedById?: string;
        remarks?: string;
    }): Promise<{
        id: string;
        courseId: string | null;
        studentId: string;
        cohortId: string | null;
        date: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        recordedById: string | null;
        remarks: string | null;
    }>;
    findStudentByStudentNumber(studentNumber: string): Promise<any>;
}
