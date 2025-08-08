import { AlumniService } from './alumni.service';
export declare class AlumniController {
    private readonly alumniService;
    constructor(alumniService: AlumniService);
    findFeatured(): Promise<{
        id: string;
        name: string;
        graduationYear: number;
        program: string;
        currentPosition: string;
        image: string;
        story: string;
    }[]>;
    findEvents(): Promise<{
        id: string;
        title: string;
        date: string;
        location: string;
        description: string;
        registrationOpen: boolean;
    }[]>;
    getStats(): Promise<{
        totalAlumni: number;
        countries: number;
        industries: {
            name: string;
            percentage: number;
        }[];
        employmentRate: number;
    }>;
    getDirectory(page?: number, limit?: number, search?: string): Promise<{
        data: {
            id: string;
            name: string;
            graduationYear: number;
            program: string;
            location: string;
            company: string;
            email: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
}
