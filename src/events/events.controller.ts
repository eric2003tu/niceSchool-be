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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create event' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

@Get()
@ApiOperation({ summary: 'Get all events' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'category', required: false, type: String })
@ApiQuery({ name: 'upcoming', required: false, type: Boolean })
@UseGuards(JwtAuthGuard) // optional if only authenticated users can see all
@ApiBearerAuth()
findAll(
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('category') category?: string,
  @Query('upcoming') upcoming?: boolean,
  @Request() req?: any,  // this gives you access to user info from auth token
) {
  const pageNumber = typeof page === 'string' ? parseInt(page, 10) || 1 : page || 1;
  const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) || 10 : limit || 10;

  // Determine if requester is admin
  const isAdmin = req?.user?.role === 'ADMIN';

  return this.eventsService.findAll(
    pageNumber,
    limitNumber,
    category,
    upcoming,
    isAdmin
  );
}



  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findUpcoming(@Query('limit') limit?: number) {
    return this.eventsService.findUpcoming(limit);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all event categories' })
  getCategories() {
    return this.eventsService.getCategories();
  }

  @Get('my-registrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user registrations' })
  getUserRegistrations(@Request() req) {
    return this.eventsService.getUserRegistrations(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for event' })
  register(
    @Param('id') id: string,
    @Body() registerDto: RegisterEventDto,
    @Request() req,
  ) {
    return this.eventsService.registerForEvent(id, req.user.userId, registerDto);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel event registration' })
  cancelRegistration(@Param('id') id: string, @Request() req) {
    return this.eventsService.cancelRegistration(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}