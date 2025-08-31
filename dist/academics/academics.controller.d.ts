import { AcademicsService } from './academics.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
export declare class AcademicsController {
    private readonly academicsService;
    constructor(academicsService: AcademicsService);
    createDepartment(dto: CreateDepartmentDto): Promise<{
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
    createProgram(dto: CreateProgramDto): Promise<{
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
    createCourse(dto: CreateCourseDto): Promise<{
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
    getCourses(programId?: string): Promise<({
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
    createCohort(dto: CreateCohortDto): Promise<{
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
    createAssignment(dto: CreateAssignmentDto): Promise<{
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
    createExam(dto: CreateExamDto): Promise<{
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
    recordExamResult(dto: CreateMarkDto): Promise<{
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
        status: import(".prisma/client").$Enums.AttendanceStatus;
        studentId: string;
        cohortId: string | null;
        courseId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
