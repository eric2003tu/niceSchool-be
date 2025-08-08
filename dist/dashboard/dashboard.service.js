"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const news_service_1 = require("../news/news.service");
const events_service_1 = require("../events/events.service");
const admissions_service_1 = require("../admissions/admissions.service");
const user_role_enum_1 = require("../common/enums/user-role.enum");
let DashboardService = class DashboardService {
    constructor(newsService, eventsService, admissionsService) {
        this.newsService = newsService;
        this.eventsService = eventsService;
        this.admissionsService = admissionsService;
    }
    async getDashboardData(userId, userRole) {
        const [recentNews, upcomingEvents] = await Promise.all([
            this.newsService.findFeatured(3),
            this.eventsService.findUpcoming(3),
        ]);
        let userSpecificData = {};
        switch (userRole) {
            case user_role_enum_1.UserRole.STUDENT:
                const [userRegistrations, userApplications] = await Promise.all([
                    this.eventsService.getUserRegistrations(userId),
                    this.admissionsService.findByApplicant(userId),
                ]);
                userSpecificData = {
                    myEventRegistrations: userRegistrations.slice(0, 5),
                    myApplications: userApplications.slice(0, 3),
                };
                break;
            case user_role_enum_1.UserRole.ADMIN:
            case user_role_enum_1.UserRole.FACULTY:
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
            case user_role_enum_1.UserRole.ALUMNI:
                userSpecificData = {
                    alumniEvents: await this.eventsService.findAll(1, 3, 'alumni'),
                    networkingOpportunities: [],
                };
                break;
            default:
                break;
        }
        return Object.assign({ welcomeMessage: this.getWelcomeMessage(userRole), recentNews,
            upcomingEvents, notifications: await this.getNotifications(userId, userRole), quickStats: await this.getQuickStats(userRole) }, userSpecificData);
    }
    getWelcomeMessage(role) {
        switch (role) {
            case user_role_enum_1.UserRole.ADMIN:
                return 'Welcome to your admin dashboard. Monitor school activities and manage content.';
            case user_role_enum_1.UserRole.FACULTY:
                return 'Welcome back! Check the latest updates and manage your responsibilities.';
            case user_role_enum_1.UserRole.STUDENT:
                return 'Welcome to your student portal. Stay updated with news, events, and your applications.';
            case user_role_enum_1.UserRole.ALUMNI:
                return 'Welcome to the alumni network. Connect with fellow graduates and discover opportunities.';
            default:
                return 'Welcome to Nice School!';
        }
    }
    async getNotifications(userId, role) {
        const baseNotifications = [];
        if (role === user_role_enum_1.UserRole.ADMIN || role === user_role_enum_1.UserRole.FACULTY) {
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
    async getQuickStats(role) {
        if (role === user_role_enum_1.UserRole.ADMIN || role === user_role_enum_1.UserRole.FACULTY) {
            const admissionStats = await this.admissionsService.getStats();
            return {
                totalApplications: admissionStats.total,
                pendingApplications: admissionStats.pending,
                acceptanceRate: `${admissionStats.acceptance_rate.toFixed(1)}%`,
                totalNews: 0,
                totalEvents: 0,
            };
        }
        return {};
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_service_1.NewsService,
        events_service_1.EventsService,
        admissions_service_1.AdmissionsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map