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
        description: string | null;
        id: string;
        name: string;
        code: string;
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
            description: string | null;
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.ProgramLevel;
            durationYears: number;
            departmentId: string;
        }[];
        courses: {
            description: string | null;
            id: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            programId: string | null;
            title: string;
            credits: number;
            semester: string | null;
        }[];
    } & {
        description: string | null;
        id: string;
        name: string;
        code: string;
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
            description: string | null;
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.ProgramLevel;
            durationYears: number;
            departmentId: string;
        }[];
        courses: {
            description: string | null;
            id: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            programId: string | null;
            title: string;
            credits: number;
            semester: string | null;
        }[];
    } & {
        description: string | null;
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        headId: string | null;
    }>;
    createProgram(data: CreateProgramDto): Promise<{
        description: string | null;
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.ProgramLevel;
        durationYears: number;
        departmentId: string;
    }>;
    getPrograms(filter?: {
        departmentId?: string;
    }): Promise<({
        courses: {
            description: string | null;
            id: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            programId: string | null;
            title: string;
            credits: number;
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
        description: string | null;
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.ProgramLevel;
        durationYears: number;
        departmentId: string;
    })[]>;
    createCourse(data: CreateCourseDto): Promise<{
        description: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        programId: string | null;
        title: string;
        credits: number;
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
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            postedAt: Date;
            dueDate: Date | null;
            totalMarks: number;
            courseId: string;
            postedById: string | null;
        }[];
        exams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            totalMarks: number;
            courseId: string;
            examDate: Date;
            durationMin: number;
            examType: import(".prisma/client").$Enums.ExamType;
            isPublished: boolean;
            createdById: string | null;
        }[];
    } & {
        description: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        programId: string | null;
        title: string;
        credits: number;
        semester: string | null;
    })[]>;
    getCohorts(filter?: {
        programId?: string;
    }): Promise<({
        attendances: {
            id: string;
            studentId: string;
            cohortId: string | null;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            courseId: string | null;
            remarks: string | null;
            date: Date;
            recordedById: string | null;
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
            cohortId: string;
            courseId: string;
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
        description: string | null;
        id: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        programId: string | null;
        title: string;
        credits: number;
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
            studentNumber: string | null;
            firstName: string;
            lastName: string;
            email: string;
            profileImage: string | null;
            phone: string | null;
            isActive: boolean;
            password: string;
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
            studentNumber: string | null;
            firstName: string;
            lastName: string;
            email: string;
            profileImage: string | null;
            phone: string | null;
            isActive: boolean;
            password: string;
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
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        postedAt: Date;
        dueDate: Date | null;
        totalMarks: number;
        courseId: string;
        postedById: string | null;
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
        totalMarks: number;
        courseId: string;
        examDate: Date;
        durationMin: number;
        examType: import(".prisma/client").$Enums.ExamType;
        isPublished: boolean;
        createdById: string | null;
    }>;
    recordExamResult(data: CreateMarkDto): Promise<{
        id: string;
        studentId: string;
        marks: number;
        grade: string | null;
        remarks: string | null;
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
        studentId: string;
        cohortId: string | null;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        courseId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
    findStudentByStudentNumber(studentNumber: string): Promise<any>;
}
