import { Injectable } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { EventsService } from '../events/events.service';
import { AdmissionsService } from '../admissions/admissions.service';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class DashboardService {
  constructor(
    private newsService: NewsService,
    private eventsService: EventsService,
    private admissionsService: AdmissionsService,
  ) {}

  async getDashboardData(userId: string, userRole: UserRole) {
    const [recentNews, upcomingEvents] = await Promise.all([
      this.newsService.findFeatured(3),
      this.eventsService.findUpcoming(3),
    ]);

    let userSpecificData = {};

    switch (userRole) {
      case UserRole.STUDENT:
        const [userRegistrations, userApplications] = await Promise.all([
          this.eventsService.getUserRegistrations(userId),
          this.admissionsService.findByApplicant(userId),
        ]);
        userSpecificData = {
          myEventRegistrations: userRegistrations.slice(0, 5),
          myApplications: userApplications.slice(0, 3),
        };
        break;

      case UserRole.ADMIN:
  case UserRole.FACULTY:
        const admissionStats = await this.admissionsService.getStats();
        userSpecificData = {
          admissionStats,
          quickActions: [
            { title: 'Manage News', path: '/admin/news' },
            { title: 'Manage Events', path: '/admin/events' },
            { title: 'Review Applications', path: '/admin/admissions' },
            { title: 'Manage Faculty', path: '/admin/faculty' },
          ],
        };
        break;

      case UserRole.ALUMNI:
        // Add alumni-specific data
        userSpecificData = {
          alumniEvents: await this.eventsService.findAll(1, 3, 'alumni'),
          networkingOpportunities: [],
        };
        break;

      default:
        break;
    }

    return {
      welcomeMessage: this.getWelcomeMessage(userRole),
      recentNews,
      upcomingEvents,
      notifications: await this.getNotifications(userId, userRole),
      quickStats: await this.getQuickStats(userRole),
      ...userSpecificData,
    };
  }

  private getWelcomeMessage(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Welcome to your admin dashboard. Monitor school activities and manage content.';
  case UserRole.FACULTY:
        return 'Welcome back! Check the latest updates and manage your responsibilities.';
      case UserRole.STUDENT:
        return 'Welcome to your student portal. Stay updated with news, events, and your applications.';
      case UserRole.ALUMNI:
        return 'Welcome to the alumni network. Connect with fellow graduates and discover opportunities.';
      default:
        return 'Welcome to Nice School!';
    }
  }

  private async getNotifications(userId: string, role: UserRole): Promise<any[]> {
    // Mock notifications - implement actual notification logic
    const baseNotifications = [];

  if (role === UserRole.ADMIN || role === UserRole.FACULTY) {
      const stats = await this.admissionsService.getStats();
      if (stats.pending > 0) {
        baseNotifications.push({
          id: '1',
          type: 'info',
          title: 'Pending Applications',
          message: `You have ${stats.pending} applications pending review.`,
          createdAt: new Date(),
        });
      }
    }

    return baseNotifications;
  }

  private async getQuickStats(role: UserRole): Promise<any> {
  if (role === UserRole.ADMIN || role === UserRole.FACULTY) {
      const admissionStats = await this.admissionsService.getStats();
      return {
        totalApplications: admissionStats.total,
        pendingApplications: admissionStats.pending,
        acceptanceRate: `${admissionStats.acceptance_rate.toFixed(1)}%`,
        totalNews: 0, // Implement actual count
        totalEvents: 0, // Implement actual count
      };
    }

    return {};
  }
}