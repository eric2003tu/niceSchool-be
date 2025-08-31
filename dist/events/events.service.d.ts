import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createEventDto: CreateEventDto): Promise<any>;
    findAll(page?: number, limit?: number, category?: string, upcoming?: boolean, isAdmin?: boolean): Promise<{
        data: ({
            registrations: {
                id: string;
                status: string;
                userId: string;
                eventId: string;
                notes: string | null;
                registeredAt: Date;
            }[];
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isPublished: boolean;
            imageUrl: string | null;
            category: string;
            startDate: Date;
            endDate: Date;
            location: string;
            isRegistrationOpen: boolean;
            maxAttendees: number;
            price: Prisma.Decimal;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    findUpcoming(limit?: number): Promise<any[]>;
    registerForEvent(eventId: string, userId: string, registerDto: RegisterEventDto): Promise<any>;
    getUserRegistrations(userId: string): Promise<any[]>;
    cancelRegistration(eventId: string, userId: string): Promise<void>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<any>;
    remove(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
}
