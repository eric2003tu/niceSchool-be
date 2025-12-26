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
                updatedAt: Date;
                notes: string | null;
                eventId: string;
                registrantId: string;
                paymentStatus: string;
                checkedInAt: Date | null;
                checkedInById: string | null;
                dietaryRequirements: string | null;
                accessibilityNeeds: string | null;
                registeredAt: Date;
            }[];
        } & {
            description: string;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            timezone: string;
            imageUrl: string | null;
            isPublished: boolean;
            publishedAt: Date | null;
            startDate: Date;
            endDate: Date;
            location: string | null;
            maxAttendees: number | null;
            slug: string;
            isAllDay: boolean;
            isVirtual: boolean;
            meetingLink: string | null;
            meetingDetails: Prisma.JsonValue;
            organizerId: string;
            departmentId: string | null;
            targetAudience: import(".prisma/client").$Enums.Role[];
            isPublic: boolean;
            requiresRegistration: boolean;
            registrationDeadline: Date | null;
            registrationFee: Prisma.Decimal;
            gallery: Prisma.JsonValue;
            agenda: string | null;
            speakers: Prisma.JsonValue;
            views: number;
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
