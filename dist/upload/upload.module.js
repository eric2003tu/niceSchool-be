"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const path_1 = require("path");
const upload_controller_1 = require("./upload.controller");
const upload_service_1 = require("./upload.service");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: configService.get('UPLOAD_DEST', './uploads'),
                        filename: (req, file, cb) => {
                            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                            cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                        },
                    }),
                    fileFilter: (req, file, cb) => {
                        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
                        const extName = allowedTypes.test((0, path_1.extname)(file.originalname).toLowerCase());
                        const mimeType = allowedTypes.test(file.mimetype);
                        if (mimeType && extName) {
                            cb(null, true);
                        }
                        else {
                            cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
                        }
                    },
                    limits: {
                        fileSize: configService.get('MAX_FILE_SIZE', 10485760),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map