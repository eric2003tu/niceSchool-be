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
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            imageUrl: string | null;
            category: string;
            isPublished: boolean;
            publishedAt: Date;
            authorId: string;
        }[];
        upcomingEvents: any[];
        notifications: any[];
        quickStats: any;
    }>;
    private getWelcomeMessage;
    private getNotifications;
    private getQuickStats;
}
