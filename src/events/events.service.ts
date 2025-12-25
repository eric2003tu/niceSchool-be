import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<any> {
    try {
      // Ensure required fields are present
      const { slug, organizer, ...rest } = createEventDto as any;
      if (!slug || !organizer) {
        throw new BadRequestException('Missing required fields: slug, organizer');
      }
      return await this.prisma.event.create({
        data: { ...rest, slug, organizer },
        include: { registrations: true }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Event with similar details already exists');
        }
      }
      throw error;
    }
  }

async findAll(
  page: number = 1,
  limit: number = 10,
  category?: string,
  upcoming?: boolean,
  isAdmin: boolean = false, // determined from auth token in controller
) {
  const where: Prisma.EventWhereInput = {};

  // Only filter by published if NOT admin
  if (!isAdmin) {
    where.isPublished = true;
  }

  // Remove category filter if not in schema
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
  try {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
      },
    });

    if (!event || !event.isPublished) {
      throw new NotFoundException('Event not found');
    }
    return event;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new BadRequestException('Failed to fetch event');
  }
}

  async findUpcoming(limit: number = 5): Promise<any[]> {
    try {
      return await this.prisma.event.findMany({
        where: {
          isPublished: true,
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: 'asc' },
        take: limit,
        include: { registrations: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch upcoming events');
    }
  }

  async registerForEvent(eventId: string, userId: string, registerDto: RegisterEventDto): Promise<any> {
    try {
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

      // Use findFirst if composite key is not defined
      // TODO: Replace with correct field names from your schema, e.g., attendeeId, eventRef, etc.
      const existingRegistration = await this.prisma.eventRegistration.findFirst({
        where: { /* attendeeId: userId, eventRef: eventId */ },
      });

      if (existingRegistration) {
        throw new BadRequestException('Already registered for this event');
      }

      // Use event and registrant relations
      return await this.prisma.eventRegistration.create({
        data: {
          event: { connect: { id: eventId } },
          registrant: { connect: { id: userId } },
          notes: registerDto.notes,
        },
        include: { event: true },
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to register for event');
    }
  }

  async getUserRegistrations(userId: string): Promise<any[]> {
    try {
      // TODO: Replace with correct field name from your schema
      return await this.prisma.eventRegistration.findMany({
        where: { /* attendeeId: userId */ },
        include: { event: true },
        orderBy: { registeredAt: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch user registrations');
    }
  }

  async cancelRegistration(eventId: string, userId: string): Promise<void> {
    try {
      // TODO: Replace with correct field names from your schema
      const registration = await this.prisma.eventRegistration.findFirst({
        where: { /* attendeeId: userId, eventRef: eventId */ },
      });

      if (!registration) {
        throw new NotFoundException('Registration not found');
      }

      await this.prisma.eventRegistration.delete({
        where: { id: registration.id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to cancel registration');
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<any> {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
        include: { registrations: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Event not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Event with similar details already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Check if event exists first
      const event = await this.prisma.event.findUnique({ where: { id } });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      // Delete related registrations first
      await this.prisma.eventRegistration.deleteMany({ where: { eventId: id } });

      // Then delete the event
      await this.prisma.event.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete event');
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      // Remove category logic if not in schema
      return [];
    } catch (error) {
      throw new BadRequestException('Failed to fetch categories');
    }
  }
}