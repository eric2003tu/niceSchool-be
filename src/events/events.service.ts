
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';


@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<any> {
    return this.prisma.event.create({ data: createEventDto });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    upcoming?: boolean,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = { isPublished: true };
    if (category && category !== 'all') {
      where.category = category;
    }
    if (upcoming) {
      where.startDate = { gte: new Date() };
    }
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startDate: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { registrations: true },
      }),
      this.prisma.event.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<any> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        registrations: { include: { user: true } },
      },
    });
    if (!event || !event.isPublished) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findUpcoming(limit: number = 5): Promise<any[]> {
    return this.prisma.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
      include: { registrations: true },
    });
  }

  async registerForEvent(eventId: string, userId: string, registerDto: RegisterEventDto): Promise<any> {
    const event = await this.findOne(eventId);
    if (!event.isRegistrationOpen) {
      throw new BadRequestException('Registration is closed for this event');
    }
    if ((event.registrations?.length || 0) >= event.maxAttendees) {
      throw new BadRequestException('Event is fully booked');
    }
    if (new Date() > event.startDate) {
      throw new BadRequestException('Cannot register for past events');
    }
    const existingRegistration = await this.prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existingRegistration) {
      throw new BadRequestException('Already registered for this event');
    }
    return this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        notes: registerDto.notes,
      },
    });
  }

  async getUserRegistrations(userId: string): Promise<any[]> {
    return this.prisma.eventRegistration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async cancelRegistration(eventId: string, userId: string): Promise<void> {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!registration) {
      throw new NotFoundException('Registration not found');
    }
    await this.prisma.eventRegistration.delete({
      where: { id: registration.id },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<any> {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
      include: { registrations: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.event.delete({ where: { id } });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.event.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map(cat => cat.category);
  }
}