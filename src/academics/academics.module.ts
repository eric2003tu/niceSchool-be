import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';

@Module({
  controllers: [AcademicsController],
  providers: [AcademicsService],
})
export class AcademicsModule {}