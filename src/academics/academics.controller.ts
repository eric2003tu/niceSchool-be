import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';

@ApiTags('academics')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('programs')
  @ApiOperation({ summary: 'Get all academic programs' })
  getPrograms() {
    return this.academicsService.getPrograms();
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  getDepartments() {
    return this.academicsService.getDepartments();
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get courses' })
  @ApiQuery({ name: 'program', required: false, type: String })
  getCourses(@Query('program') program?: string) {
    return this.academicsService.getCourses(program);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get academic calendar' })
  getCalendar() {
    return this.academicsService.getAcademicCalendar();
  }
}