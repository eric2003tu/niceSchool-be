import { ApplicationStatus } from '../../common/enums/application-status.enum';
export declare class UpdateStatusDto {
    status: ApplicationStatus;
    adminNotes?: string;
}
