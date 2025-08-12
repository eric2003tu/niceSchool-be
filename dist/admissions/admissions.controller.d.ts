import { AdmissionsService } from './admissions.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApplicationStatus } from '../common/enums/application-status.enum';
export declare class AdmissionsController {
    private readonly admissionsService;
    constructor(admissionsService: AdmissionsService);
    getRequirements(): Promise<any>;
    getStats(): Promise<any>;
    create(createApplicationDto: CreateApplicationDto, req: any): Promise<any>;
    findAll(page?: string | number, limit?: string | number, status?: ApplicationStatus, program?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findMyApplications(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    submit(id: string): Promise<any>;
    updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<any>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any>;
    remove(id: string): Promise<void>;
}
