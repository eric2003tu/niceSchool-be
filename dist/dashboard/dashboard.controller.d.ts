import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any): Promise<{
        welcomeMessage: string;
        recentNews: any[];
        upcomingEvents: any[];
        notifications: any[];
        quickStats: any;
    }>;
}
