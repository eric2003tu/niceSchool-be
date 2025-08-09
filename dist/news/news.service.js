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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NewsService = class NewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createNewsDto, authorId) {
        return this.prisma.news.create({
            data: Object.assign(Object.assign({}, createNewsDto), { authorId }),
        });
    }
    async findAll(page = 1, limit = 10, category, search) {
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const where = { isPublished: true };
        if (category && category !== 'all') {
            where.category = category;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }
        const [data, total] = await Promise.all([
            this.prisma.news.findMany({
                where,
                orderBy: { publishedAt: 'desc' },
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.news.count({ where }),
        ]);
        return { data, total, page: pageNumber, limit: limitNumber };
    }
    async findOne(id) {
        const news = await this.prisma.news.findUnique({
            where: { id },
            include: { author: true },
        });
        if (!news || !news.isPublished) {
            throw new common_1.NotFoundException('News article not found');
        }
        return news;
    }
    async findFeatured(limit = 5) {
        return this.prisma.news.findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
            take: limit,
            include: { author: true },
        });
    }
    async findByCategory(category) {
        return this.prisma.news.findMany({
            where: { category, isPublished: true },
            orderBy: { publishedAt: 'desc' },
            include: { author: true },
        });
    }
    async update(id, updateNewsDto) {
        return this.prisma.news.update({
            where: { id },
            data: updateNewsDto,
            include: { author: true },
        });
    }
    async remove(id) {
        await this.prisma.news.delete({ where: { id } });
    }
    async getCategories() {
        const categories = await this.prisma.news.findMany({
            where: { isPublished: true },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map(cat => cat.category);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsService);
//# sourceMappingURL=news.service.js.map