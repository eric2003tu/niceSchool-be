import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  generateFileUrl(filename: string): string {
    // In production, this would be your CDN or file server URL
    return `/uploads/${filename}`;
  }

  validateFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    return allowedMimeTypes.includes(file.mimetype);
  }
}