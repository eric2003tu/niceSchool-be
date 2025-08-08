"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const news_module_1 = require("./news/news.module");
const events_module_1 = require("./events/events.module");
const admissions_module_1 = require("./admissions/admissions.module");
const faculty_module_1 = require("./faculty/faculty.module");
const alumni_module_1 = require("./alumni/alumni.module");
const contact_module_1 = require("./contact/contact.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const campus_module_1 = require("./campus/campus.module");
const academics_module_1 = require("./academics/academics.module");
const upload_module_1 = require("./upload/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            news_module_1.NewsModule,
            events_module_1.EventsModule,
            admissions_module_1.AdmissionsModule,
            faculty_module_1.FacultyModule,
            alumni_module_1.AlumniModule,
            contact_module_1.ContactModule,
            dashboard_module_1.DashboardModule,
            campus_module_1.CampusModule,
            academics_module_1.AcademicsModule,
            upload_module_1.UploadModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map