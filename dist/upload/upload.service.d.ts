/// <reference types="multer" />
export declare class UploadService {
    generateFileUrl(filename: string): string;
    validateFile(file: Express.Multer.File): boolean;
}
