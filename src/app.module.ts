import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
})
export class AppModule {}