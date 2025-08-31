import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any): Promise<{
        welcomeMessage: string;
        recentNews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            isPublished: boolean;
            excerpt: string | null;
            imageUrl: string | null;
            category: string;
            publishedAt: Date;
            authorId: string;
        }[];
        upcomingEvents: any[];
        notifications: any[];
        quickStats: any;
    }>;
}
