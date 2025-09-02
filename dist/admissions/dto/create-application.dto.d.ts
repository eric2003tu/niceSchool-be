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
declare class RefDto {
    id?: string;
    name?: string;
}
export declare class CreateApplicationDto {
    programId?: string;
    departmentId?: string;
    courseId?: string;
    program?: RefDto;
    department?: RefDto;
    course?: RefDto;
    academicYear: string;
    personalInfo: PersonalInfoDto;
    academicInfo: AcademicInfoDto;
    documents?: DocumentsDto;
    personalStatement?: string;
}
export {};
