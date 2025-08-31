import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';

@ApiTags('admissions')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Get('requirements')
  @ApiOperation({ summary: 'Get admission requirements' })
  getRequirements() {
    return this.admissionsService.getRequirements();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admission statistics (Admin/Staff only)' })
  getStats() {
    return this.admissionsService.getStats();
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit application' })
  create(@Body() createApplicationDto: CreateApplicationDto, @Request() req: any) {
    return this.admissionsService.create(createApplicationDto, req.user.userId);
  }

@Get('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.FACULTY)
@ApiBearerAuth()
@ApiOperation({ summary: 'Get all applications (Admin/Staff only)' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'status', required: false, enum: ApplicationStatus })
@ApiQuery({ name: 'program', required: false, type: String })
findAll(
  @Query('page') page?: string | number,
  @Query('limit') limit?: string | number,
  @Query('status') status?: ApplicationStatus,
  @Query('program') program?: string,
) {
  // Convert page and limit to numbers explicitly
  const pageNumber = typeof page === 'string' ? parseInt(page, 10) || 1 : page || 1;
  const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) || 10 : limit || 10;

  return this.admissionsService.findAll(
    pageNumber,
    limitNumber,
    status,
    program
  );
}

  @Get('my-applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user applications' })
  findMyApplications(@Request() req: any) {
    return this.admissionsService.findByApplicant(req.user.userId);
  }

  @Get('applications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID' })
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @Patch('applications/:id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit application for review' })
  submit(@Param('id') id: string) {
    return this.admissionsService.submitApplication(id);
  }

  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status (Admin/Staff only)' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.admissionsService.updateStatus(id, updateStatusDto.status, updateStatusDto.adminNotes);
  }

  @Patch('applications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application' })
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.admissionsService.update(id, updateApplicationDto);
  }

  @Delete('applications/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete application' })
  remove(@Param('id') id: string) {
    return this.admissionsService.remove(id);
  }
}