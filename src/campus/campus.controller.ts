import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CampusService } from './campus.service';

@ApiTags('campus')
@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Get('facilities')
  @ApiOperation({ summary: 'Get campus facilities' })
  getFacilities() {
    return this.campusService.getFacilities();
  }

  @Get('info')
  @ApiOperation({ summary: 'Get general campus information' })
  getCampusInfo() {
    return this.campusService.getCampusInfo();
  }

  @Get('directions')
  @ApiOperation({ summary: 'Get directions and parking info' })
  getDirections() {
    return this.campusService.getDirections();
  }

  @Get('virtual-tour')
  @ApiOperation({ summary: 'Get virtual tour information' })
  getVirtualTour() {
    return this.campusService.getVirtualTour();
  }
}