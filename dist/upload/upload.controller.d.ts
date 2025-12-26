/// <reference types="multer" />
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): {
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
        url: string;
    };
}
