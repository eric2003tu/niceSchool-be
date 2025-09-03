import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<any>;
    findAll(page?: number, limit?: number, category?: string, upcoming?: boolean, req?: any): Promise<{
        data: ({
            registrations: {
                id: string;
                userId: string;
                eventId: string;
                status: string;
                notes: string | null;
                registeredAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            category: string;
            isPublished: boolean;
            startDate: Date;
            endDate: Date;
            location: string;
            isRegistrationOpen: boolean;
            maxAttendees: number;
            price: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findAllPublic(page?: number, limit?: number, category?: string, upcoming?: boolean): Promise<{
        data: ({
            registrations: {
                id: string;
                userId: string;
                eventId: string;
                status: string;
                notes: string | null;
                registeredAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            title: string;
            imageUrl: string | null;
            category: string;
            isPublished: boolean;
            startDate: Date;
            endDate: Date;
            location: string;
            isRegistrationOpen: boolean;
            maxAttendees: number;
            price: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserRegistrations(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    register(id: string, registerDto: RegisterEventDto, req: any): Promise<any>;
    cancelRegistration(id: string, req: any): Promise<void>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<any>;
    remove(id: string): Promise<void>;
}
