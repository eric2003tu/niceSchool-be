import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any): Promise<{
        welcomeMessage: string;
        recentNews: {
            id: string;
            title: string;
            imageUrl: string | null;
            category: string;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            excerpt: string | null;
            publishedAt: Date;
            authorId: string;
        }[];
        upcomingEvents: any[];
        notifications: any[];
        quickStats: any;
    }>;
}
