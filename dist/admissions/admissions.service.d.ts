import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
export declare class AdmissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createApplicationDto: CreateApplicationDto, applicantId: string): Promise<any>;
    findAll(page?: number, limit?: number, status?: ApplicationStatus, program?: string, department?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    findByApplicant(applicantId: string): Promise<any[]>;
    submitApplication(id: string): Promise<any>;
    updateStatus(id: string, status: ApplicationStatus, adminNotes?: string): Promise<any>;
    private generateUniqueStudentNumber;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any>;
    remove(id: string): Promise<void>;
    getRequirements(): Promise<any>;
    getStats(): Promise<any>;
}
