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
                updatedAt: Date;
                eventId: string;
                registrantId: string;
                status: string;
                paymentStatus: string;
                checkedInAt: Date | null;
                checkedInById: string | null;
                dietaryRequirements: string | null;
                accessibilityNeeds: string | null;
                notes: string | null;
                registeredAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            title: string;
            description: string;
            slug: string;
            startDate: Date;
            endDate: Date;
            isAllDay: boolean;
            timezone: string;
            location: string | null;
            isVirtual: boolean;
            meetingLink: string | null;
            meetingDetails: Prisma.JsonValue | null;
            organizerId: string;
            departmentId: string | null;
            targetAudience: import(".prisma/client").$Enums.Role[];
            isPublic: boolean;
            maxAttendees: number | null;
            requiresRegistration: boolean;
            registrationDeadline: Date | null;
            registrationFee: Prisma.Decimal;
            imageUrl: string | null;
            gallery: Prisma.JsonValue | null;
            agenda: string | null;
            speakers: Prisma.JsonValue | null;
            isPublished: boolean;
            publishedAt: Date | null;
            views: number;
            updatedAt: Date;
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
