import { ApplicationStatus } from '../../common/enums/application-status.enum';
export declare class Application {
    id: string;
    applicantId: string;
    program: string;
    academicYear: string;
    status: ApplicationStatus;
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        address: string;
        nationality: string;
    };
    academicInfo: {
        previousEducation: string;
        gpa: number;
        graduationYear: number;
        institution: string;
    };
    documents: {
        transcript: string;
        recommendationLetter: string;
        personalStatement: string;
        idDocument: string;
    };
    personalStatement: string;
    adminNotes: string;
    submittedAt: Date;
    reviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
