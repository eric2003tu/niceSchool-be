import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createNewsDto: CreateNewsDto, authorId: string): Promise<any>;
    findAll(page?: number | string, limit?: number | string, category?: string, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    findFeatured(limit?: number): Promise<any[]>;
    findByCategory(category: string): Promise<any[]>;
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<any>;
    remove(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
}
