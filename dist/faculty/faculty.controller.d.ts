import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
export declare class FacultyController {
    private readonly facultyService;
    constructor(facultyService: FacultyService);
    create(createFacultyDto: CreateFacultyDto): Promise<any>;
    findAll(page?: number, limit?: number, department?: string, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getDepartments(): Promise<string[]>;
    findByDepartment(department: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<any>;
    remove(id: string): Promise<void>;
}
