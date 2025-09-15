import { NewsService } from '../news/news.service';
import { EventsService } from '../events/events.service';
import { AdmissionsService } from '../admissions/admissions.service';
import { UserRole } from '../common/enums/user-role.enum';
export declare class DashboardService {
    private newsService;
    private eventsService;
    private admissionsService;
    constructor(newsService: NewsService, eventsService: EventsService, admissionsService: AdmissionsService);
    getDashboardData(userId: string, userRole: UserRole): Promise<{
        welcomeMessage: string;
        recentNews: {
            id: string;
            title: string;
            content: string;
            excerpt: string | null;
            imageUrl: string | null;
            category: string;
            isPublished: boolean;
            publishedAt: Date;
            authorId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        upcomingEvents: any[];
        notifications: any[];
        quickStats: any;
    }>;
    private getWelcomeMessage;
    private getNotifications;
    private getQuickStats;
}
