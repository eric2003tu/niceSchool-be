import { PrismaService } from '../prisma/prisma.service';
import { News } from '@prisma/client';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createNewsDto: CreateNewsDto, authorId: string): Promise<News>;
    findAll(page?: number | string, limit?: number | string, category?: string, search?: string): Promise<{
        data: News[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<News>;
    findFeatured(limit?: number): Promise<News[]>;
    findByCategory(category: string): Promise<News[]>;
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<News>;
    remove(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
}
