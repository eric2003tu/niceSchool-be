import { PrismaService } from '../prisma/prisma.service';
export declare class AcademicsService {
    private prisma;
    constructor(prisma: PrismaService);
    createDepartment(data: any): Promise<{
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
        };
        programs: {
            level: import(".prisma/client").$Enums.ProgramLevel;
            id: string;
            name: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        };
        programs: {
            level: import(".prisma/client").$Enums.ProgramLevel;
            id: string;
            name: string;
            code: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
    createProgram(data: any): Promise<{
        level: import(".prisma/client").$Enums.ProgramLevel;
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
        durationYears: number;
    }>;
    getPrograms(): Promise<({
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
        level: import(".prisma/client").$Enums.ProgramLevel;
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
        durationYears: number;
    })[]>;
    createCourse(data: any): Promise<{
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
    getCourses(filter?: any): Promise<({
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
    createCohort(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string;
        intakeYear: number;
    }>;
    enrollStudent(data: any): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
        studentId: string;
        cohortId: string;
    }>;
    createAssignment(data: any): Promise<{
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
    submitAssignment(data: any): Promise<{
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
    createExam(data: any): Promise<{
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
    recordExamResult(data: any): Promise<{
        id: string;
        studentId: string;
        marks: number;
        grade: string | null;
        remarks: string | null;
        recordedAt: Date;
        examId: string;
    }>;
    recordAttendance(data: any): Promise<{
        id: string;
        courseId: string | null;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        cohortId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
