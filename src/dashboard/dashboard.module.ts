import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { NewsModule } from '../news/news.module';
import { EventsModule } from '../events/events.module';
import { AdmissionsModule } from '../admissions/admissions.module';

@Module({
  imports: [NewsModule, EventsModule, AdmissionsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}