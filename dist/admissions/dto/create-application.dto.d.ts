declare class PersonalInfoDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    nationality: string;
}
declare class AcademicInfoDto {
    previousEducation: string;
    gpa: number;
    graduationYear: number;
    institution: string;
}
declare class DocumentsDto {
    transcript?: string;
    recommendationLetter?: string;
    personalStatement?: string;
    idDocument?: string;
}
export declare class CreateApplicationDto {
    program: string;
    academicYear: string;
    personalInfo: PersonalInfoDto;
    academicInfo: AcademicInfoDto;
    documents?: DocumentsDto;
    personalStatement?: string;
}
export {};
