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
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        headId: string | null;
    }>;
    getDepartments(): Promise<({
        courses: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        head: {
            department: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profileImage: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            position: string;
            bio: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
        } | null;
        programs: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            level: import(".prisma/client").$Enums.ProgramLevel;
            departmentId: string;
            durationYears: number;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        headId: string | null;
    })[]>;
    getDepartment(id: string): Promise<{
        courses: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        head: {
            department: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profileImage: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            position: string;
            bio: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
        } | null;
        programs: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            level: import(".prisma/client").$Enums.ProgramLevel;
            departmentId: string;
            durationYears: number;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        headId: string | null;
    }>;
    createProgram(data: CreateProgramDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    }>;
    getPrograms(): Promise<({
        courses: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        cohorts: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            programId: string;
            intakeYear: number;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    })[]>;
    createCourse(data: CreateCourseDto): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    }>;
    getCourses(filter?: {
        programId?: string;
    }): Promise<({
        instructors: {
            department: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profileImage: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            position: string;
            bio: string | null;
            office: string | null;
            specializations: string[];
            education: string[];
            publications: string[];
        }[];
        assignments: {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            dueDate: Date | null;
            totalMarks: number;
            postedAt: Date;
            postedById: string | null;
        }[];
        exams: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPublished: boolean;
            courseId: string;
            totalMarks: number;
            examDate: Date;
            durationMin: number;
            examType: import(".prisma/client").$Enums.ExamType;
            createdById: string | null;
        }[];
    } & {
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    })[]>;
    createCohort(data: CreateCohortDto): Promise<{
        name: string;
        id: string;
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
        studentId: string;
        enrolledAt: Date;
        leftAt: Date | null;
        cohortId: string;
    }>;
    createAssignment(data: CreateAssignmentDto): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        dueDate: Date | null;
        totalMarks: number;
        postedAt: Date;
        postedById: string | null;
    }>;
    submitAssignment(data: SubmitAssignmentDto): Promise<{
        id: string;
        submittedAt: Date;
        studentId: string;
        assignmentId: string;
        submissionText: string | null;
        fileUrl: string | null;
        marksAwarded: number | null;
        gradedAt: Date | null;
        feedback: string | null;
        gradedById: string | null;
    }>;
    createExam(data: CreateExamDto): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        courseId: string;
        totalMarks: number;
        examDate: Date;
        durationMin: number;
        examType: import(".prisma/client").$Enums.ExamType;
        createdById: string | null;
    }>;
    recordExamResult(data: CreateMarkDto): Promise<{
        id: string;
        examId: string;
        studentId: string;
        marks: number;
        grade: string | null;
        remarks: string | null;
        recordedAt: Date;
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
        courseId: string | null;
        studentId: string;
        remarks: string | null;
        cohortId: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
