import { AcademicsService } from './academics.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { CreateStudentAndEnrollDto } from './dto/create-student-enroll.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateMarkDto } from './dto/create-mark.dto';
export declare class AcademicsController {
    private readonly academicsService;
    constructor(academicsService: AcademicsService);
    createDepartment(dto: CreateDepartmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        code: string;
        headId: string | null;
    }>;
    getDepartments(): Promise<({
        head: {
            department: string;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            phone: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            code: string;
            level: import(".prisma/client").$Enums.ProgramLevel;
            departmentId: string;
            durationYears: number;
        }[];
        courses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        code: string;
        headId: string | null;
    })[]>;
    createProgram(dto: CreateProgramDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        code: string;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    }>;
    getPrograms(departmentId?: string): Promise<({
        courses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        cohorts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            programId: string;
            intakeYear: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        code: string;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    })[]>;
    getProgramsByDepartment(id: string): Promise<({
        courses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            code: string;
            departmentId: string | null;
            credits: number;
            programId: string | null;
            semester: string | null;
        }[];
        cohorts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            programId: string;
            intakeYear: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        code: string;
        level: import(".prisma/client").$Enums.ProgramLevel;
        departmentId: string;
        durationYears: number;
    })[]>;
    getCoursesByProgram(id: string): Promise<({
        instructors: {
            department: string;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            phone: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            courseId: string;
            postedAt: Date;
            dueDate: Date | null;
            totalMarks: number;
            postedById: string | null;
        }[];
        exams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isPublished: boolean;
            courseId: string;
            totalMarks: number;
            examDate: Date;
            durationMin: number;
            examType: import(".prisma/client").$Enums.ExamType;
            createdById: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    })[]>;
    getCohortsByProgram(id: string): Promise<({
        attendances: {
            id: string;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            courseId: string | null;
            studentId: string;
            cohortId: string | null;
            remarks: string | null;
            date: Date;
            recordedById: string | null;
        }[];
        students: {
            id: string;
            status: string;
            enrolledAt: Date;
            studentId: string;
            cohortId: string;
            leftAt: Date | null;
        }[];
        timetable: {
            id: string;
            location: string | null;
            courseId: string;
            cohortId: string;
            instructorId: string | null;
            day: import(".prisma/client").$Enums.DayOfWeek;
            startTime: Date;
            endTime: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        programId: string;
        intakeYear: number;
    })[]>;
    getStudentsByProgram(id: string): Promise<any>;
    enrollStudentToProgram(id: string, data: {
        studentId: string;
        cohortId?: string;
    }): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    createStudentAndEnroll(id: string, dto: CreateStudentAndEnrollDto): Promise<{
        student: any;
        enrollment: {
            id: string;
            status: string;
            enrolledAt: Date;
            studentId: string;
            cohortId: string;
            leftAt: Date | null;
        };
        temporaryPassword: string;
    }>;
    findStudentByNumber(studentNumber: string): Promise<any>;
    getTeachersByProgram(id: string): Promise<{
        department: string;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImage: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        position: string;
        bio: string | null;
        office: string | null;
        specializations: string[];
        education: string[];
        publications: string[];
    }[]>;
    addTeacherToProgram(id: string, data: {
        facultyId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    }[]>;
    getEnrollmentsByProgram(id: string): Promise<({
        cohort: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            programId: string;
            intakeYear: number;
        };
        student: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            studentNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImage: string | null;
            phone: string | null;
            dateOfBirth: Date | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    })[]>;
    getEnrollmentByProgram(id: string, enrollmentId: string): Promise<{
        cohort: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            programId: string;
            intakeYear: number;
        };
        student: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            studentNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            profileImage: string | null;
            phone: string | null;
            dateOfBirth: Date | null;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    createEnrollmentForProgram(id: string, data: {
        studentId: string;
        cohortId?: string;
        status?: string;
    }): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    updateEnrollmentForProgram(id: string, enrollmentId: string, data: any): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    removeEnrollmentForProgram(id: string, enrollmentId: string): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    createCourse(dto: CreateCourseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    }>;
    getCourses(programId?: string): Promise<({
        instructors: {
            department: string;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profileImage: string | null;
            phone: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            courseId: string;
            postedAt: Date;
            dueDate: Date | null;
            totalMarks: number;
            postedById: string | null;
        }[];
        exams: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isPublished: boolean;
            courseId: string;
            totalMarks: number;
            examDate: Date;
            durationMin: number;
            examType: import(".prisma/client").$Enums.ExamType;
            createdById: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        departmentId: string | null;
        credits: number;
        programId: string | null;
        semester: string | null;
    })[]>;
    createCohort(dto: CreateCohortDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        programId: string;
        intakeYear: number;
    }>;
    enrollStudent(data: any): Promise<{
        id: string;
        status: string;
        enrolledAt: Date;
        studentId: string;
        cohortId: string;
        leftAt: Date | null;
    }>;
    createAssignment(dto: CreateAssignmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        courseId: string;
        postedAt: Date;
        dueDate: Date | null;
        totalMarks: number;
        postedById: string | null;
    }>;
    submitAssignment(data: any): Promise<{
        id: string;
        submittedAt: Date;
        studentId: string;
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
        isPublished: boolean;
        courseId: string;
        totalMarks: number;
        examDate: Date;
        durationMin: number;
        examType: import(".prisma/client").$Enums.ExamType;
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
        courseId: string | null;
        studentId: string;
        cohortId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
