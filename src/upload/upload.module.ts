import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOAD_DEST', './uploads'),
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
          const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
          const mimeType = allowedTypes.test(file.mimetype);
          
          if (mimeType && extName) {
            cb(null, true); // Accept file
          } else {
            cb(new Error('Invalid file type. Only images and documents are allowed.'), false); // Reject file
          }
        },
        limits: {
          fileSize: configService.get('MAX_FILE_SIZE', 10485760), // 10MB default
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}