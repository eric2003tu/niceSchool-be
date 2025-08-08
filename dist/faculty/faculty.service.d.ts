import { PrismaService } from '../prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
export declare class FacultyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createFacultyDto: CreateFacultyDto): Promise<any>;
    findAll(page?: number, limit?: number, department?: string, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    findByDepartment(department: string): Promise<any[]>;
    update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<any>;
    remove(id: string): Promise<void>;
    getDepartments(): Promise<string[]>;
}
