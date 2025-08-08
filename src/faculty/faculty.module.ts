import { Module } from '@nestjs/common';

import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}