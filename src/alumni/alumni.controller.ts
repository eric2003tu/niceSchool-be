import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AlumniService } from './alumni.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('alumni')
@Controller('alumni')
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Get featured alumni' })
  findFeatured() {
    return this.alumniService.findFeatured();
  }

  @Get('events')
  @ApiOperation({ summary: 'Get alumni events' })
  findEvents() {
    return this.alumniService.findEvents();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get alumni statistics' })
  getStats() {
    return this.alumniService.getStats();
  }

  @Get('directory')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get alumni directory (Login required)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  getDirectory(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.alumniService.getDirectory(page, limit, search);
  }
}