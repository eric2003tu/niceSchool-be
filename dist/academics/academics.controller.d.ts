import { AcademicsService } from './academics.service';
export declare class AcademicsController {
    private readonly academicsService;
    constructor(academicsService: AcademicsService);
    getPrograms(): Promise<{
        id: string;
        name: string;
        degree: string;
        duration: string;
        credits: number;
        description: string;
        courses: string[];
    }[]>;
    getDepartments(): Promise<{
        id: string;
        name: string;
        head: string;
        faculty: number;
        students: number;
        programs: string[];
    }[]>;
    getCourses(program?: string): Promise<{
        id: string;
        code: string;
        name: string;
        credits: number;
        program: string;
        semester: number;
        prerequisites: string[];
    }[]>;
    getCalendar(): Promise<{
        currentSemester: string;
        importantDates: {
            date: string;
            event: string;
        }[];
        holidays: {
            date: string;
            name: string;
        }[];
    }>;
}
