import { Module } from '@nestjs/common';
// Throttler removed due to package version issues; using simple rate limiter in main.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { EventsModule } from './events/events.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { FacultyModule } from './faculty/faculty.module';
import { AlumniModule } from './alumni/alumni.module';
import { ContactModule } from './contact/contact.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CampusModule } from './campus/campus.module';
import { AcademicsModule } from './academics/academics.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  HealthModule,
  PrismaModule,
    AuthModule,
    UsersModule,
    NewsModule,
    EventsModule,
    AdmissionsModule,
    FacultyModule,
    AlumniModule,
    ContactModule,
    DashboardModule,
    CampusModule,
    AcademicsModule,
    UploadModule,
  ],
  // providers: [],
})
export class AppModule {}