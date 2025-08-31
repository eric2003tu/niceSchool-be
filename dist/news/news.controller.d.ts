import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        isPublished: boolean;
        publishedAt: Date;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, category?: string, search?: string): Promise<{
        data: import(".prisma/client").News[];
        total: number;
        page: number;
        limit: number;
    }>;
    findFeatured(limit?: number): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        isPublished: boolean;
        publishedAt: Date;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCategories(): Promise<string[]>;
    findByCategory(category: string): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        isPublished: boolean;
        publishedAt: Date;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        isPublished: boolean;
        publishedAt: Date;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        isPublished: boolean;
        publishedAt: Date;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
