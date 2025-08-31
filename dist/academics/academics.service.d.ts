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
        };
        programs: {
            description: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
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
            title: string;
            credits: number;
            semester: string | null;
            programId: string | null;
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
        };
        programs: {
            description: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
            id: string;
            name: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
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
            title: string;
            credits: number;
            semester: string | null;
            programId: string | null;
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
        level: import(".prisma/client").$Enums.ProgramLevel;
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
        durationYears: number;
        departmentId: string;
    }>;
    getPrograms(): Promise<({
        courses: {
            description: string | null;
            id: string;
            code: string;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            title: string;
            credits: number;
            semester: string | null;
            programId: string | null;
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
        level: import(".prisma/client").$Enums.ProgramLevel;
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
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
        title: string;
        credits: number;
        semester: string | null;
        programId: string | null;
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
        title: string;
        credits: number;
        semester: string | null;
        programId: string | null;
    })[]>;
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
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
        studentId: string;
        cohortId: string;
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
        status: import(".prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        cohortId: string | null;
        courseId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
