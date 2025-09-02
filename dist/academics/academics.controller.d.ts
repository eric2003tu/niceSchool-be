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
    createProgram(dto: CreateProgramDto): Promise<{
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
    getPrograms(departmentId?: string): Promise<({
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
    getProgramsByDepartment(id: string): Promise<({
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
    getCoursesByProgram(id: string): Promise<({
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
    getCohortsByProgram(id: string): Promise<({
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
    getStudentsByProgram(id: string): Promise<any>;
    enrollStudentToProgram(id: string, data: {
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
    createStudentAndEnroll(id: string, dto: CreateStudentAndEnrollDto): Promise<{
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
    findStudentByNumber(studentNumber: string): Promise<any>;
    getTeachersByProgram(id: string): Promise<{
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
    addTeacherToProgram(id: string, data: {
        facultyId: string;
    }): Promise<{
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
    getEnrollmentsByProgram(id: string): Promise<({
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
    getEnrollmentByProgram(id: string, enrollmentId: string): Promise<{
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
    createEnrollmentForProgram(id: string, data: {
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
    updateEnrollmentForProgram(id: string, enrollmentId: string, data: any): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    removeEnrollmentForProgram(id: string, enrollmentId: string): Promise<{
        id: string;
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
    }>;
    createCourse(dto: CreateCourseDto): Promise<{
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
        programId: string | null;
        title: string;
        credits: number;
        semester: string | null;
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
        studentId: string;
        cohortId: string;
        status: string;
        enrolledAt: Date;
        leftAt: Date | null;
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
        studentId: string;
        cohortId: string | null;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        courseId: string | null;
        remarks: string | null;
        date: Date;
        recordedById: string | null;
    }>;
}
