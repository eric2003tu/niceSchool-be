import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<any>;
    findAll(page?: number, limit?: number, category?: string, upcoming?: boolean): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findUpcoming(limit?: number): Promise<any[]>;
    getCategories(): Promise<string[]>;
    getUserRegistrations(req: any): Promise<any[]>;
    findOne(id: string): Promise<any>;
    register(id: string, registerDto: RegisterEventDto, req: any): Promise<any>;
    cancelRegistration(id: string, req: any): Promise<void>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<any>;
    remove(id: string): Promise<void>;
}
