import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any): Promise<{
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
}
