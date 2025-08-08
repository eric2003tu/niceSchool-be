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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEventDto) {
        return this.prisma.event.create({ data: createEventDto });
    }
    async findAll(page = 1, limit = 10, category, upcoming) {
        const where = { isPublished: true };
        if (category && category !== 'all') {
            where.category = category;
        }
        if (upcoming) {
            where.startDate = { gte: new Date() };
        }
        const [data, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy: { startDate: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { registrations: true },
            }),
            this.prisma.event.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                registrations: { include: { user: true } },
            },
        });
        if (!event || !event.isPublished) {
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async findUpcoming(limit = 5) {
        return this.prisma.event.findMany({
            where: {
                isPublished: true,
                startDate: { gte: new Date() },
            },
            orderBy: { startDate: 'asc' },
            take: limit,
            include: { registrations: true },
        });
    }
    async registerForEvent(eventId, userId, registerDto) {
        var _a;
        const event = await this.findOne(eventId);
        if (!event.isRegistrationOpen) {
            throw new common_1.BadRequestException('Registration is closed for this event');
        }
        if ((((_a = event.registrations) === null || _a === void 0 ? void 0 : _a.length) || 0) >= event.maxAttendees) {
            throw new common_1.BadRequestException('Event is fully booked');
        }
        if (new Date() > event.startDate) {
            throw new common_1.BadRequestException('Cannot register for past events');
        }
        const existingRegistration = await this.prisma.eventRegistration.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });
        if (existingRegistration) {
            throw new common_1.BadRequestException('Already registered for this event');
        }
        return this.prisma.eventRegistration.create({
            data: {
                userId,
                eventId,
                notes: registerDto.notes,
            },
        });
    }
    async getUserRegistrations(userId) {
        return this.prisma.eventRegistration.findMany({
            where: { userId },
            include: { event: true },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async cancelRegistration(eventId, userId) {
        const registration = await this.prisma.eventRegistration.findUnique({
            where: { userId_eventId: { userId, eventId } },
        });
        if (!registration) {
            throw new common_1.NotFoundException('Registration not found');
        }
        await this.prisma.eventRegistration.delete({
            where: { id: registration.id },
        });
    }
    async update(id, updateEventDto) {
        return this.prisma.event.update({
            where: { id },
            data: updateEventDto,
            include: { registrations: true },
        });
    }
    async remove(id) {
        await this.prisma.event.delete({ where: { id } });
    }
    async getCategories() {
        const categories = await this.prisma.event.findMany({
            where: { isPublished: true },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map(cat => cat.category);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map