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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createEventDto) {
        try {
            const _a = createEventDto, { slug, organizer } = _a, rest = __rest(_a, ["slug", "organizer"]);
            if (!slug || !organizer) {
                throw new common_1.BadRequestException('Missing required fields: slug, organizer');
            }
            return await this.prisma.event.create({
                data: Object.assign(Object.assign({}, rest), { slug, organizer }),
                include: { registrations: true }
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('Event with similar details already exists');
                }
            }
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, category, upcoming, isAdmin = false) {
        const where = {};
        if (!isAdmin) {
            where.isPublished = true;
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
        try {
            const event = await this.prisma.event.findUnique({
                where: { id },
                include: {
                    registrations: true,
                },
            });
            if (!event || !event.isPublished) {
                throw new common_1.NotFoundException('Event not found');
            }
            return event;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException('Failed to fetch event');
        }
    }
    async findUpcoming(limit = 5) {
        try {
            return await this.prisma.event.findMany({
                where: {
                    isPublished: true,
                    startDate: { gte: new Date() },
                },
                orderBy: { startDate: 'asc' },
                take: limit,
                include: { registrations: true },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch upcoming events');
        }
    }
    async registerForEvent(eventId, userId, registerDto) {
        var _a;
        try {
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
            const existingRegistration = await this.prisma.eventRegistration.findFirst({
                where: {},
            });
            if (existingRegistration) {
                throw new common_1.BadRequestException('Already registered for this event');
            }
            return await this.prisma.eventRegistration.create({
                data: {
                    event: { connect: { id: eventId } },
                    registrant: { connect: { id: userId } },
                    notes: registerDto.notes,
                },
                include: { event: true },
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to register for event');
        }
    }
    async getUserRegistrations(userId) {
        try {
            return await this.prisma.eventRegistration.findMany({
                where: {},
                include: { event: true },
                orderBy: { registeredAt: 'desc' },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch user registrations');
        }
    }
    async cancelRegistration(eventId, userId) {
        try {
            const registration = await this.prisma.eventRegistration.findFirst({
                where: {},
            });
            if (!registration) {
                throw new common_1.NotFoundException('Registration not found');
            }
            await this.prisma.eventRegistration.delete({
                where: { id: registration.id },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException('Failed to cancel registration');
        }
    }
    async update(id, updateEventDto) {
        try {
            return await this.prisma.event.update({
                where: { id },
                data: updateEventDto,
                include: { registrations: true },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException('Event not found');
                }
                if (error.code === 'P2002') {
                    throw new common_1.BadRequestException('Event with similar details already exists');
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            const event = await this.prisma.event.findUnique({ where: { id } });
            if (!event) {
                throw new common_1.NotFoundException('Event not found');
            }
            await this.prisma.eventRegistration.deleteMany({ where: { eventId: id } });
            await this.prisma.event.delete({ where: { id } });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException('Failed to delete event');
        }
    }
    async getCategories() {
        try {
            return [];
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch categories');
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map