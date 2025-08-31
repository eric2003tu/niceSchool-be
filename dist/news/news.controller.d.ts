import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPublished: boolean;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        publishedAt: Date;
        authorId: string;
    }>;
    findAll(page?: number, limit?: number, category?: string, search?: string): Promise<{
        data: import(".prisma/client").News[];
        total: number;
        page: number;
        limit: number;
    }>;
    findFeatured(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPublished: boolean;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        publishedAt: Date;
        authorId: string;
    }[]>;
    getCategories(): Promise<string[]>;
    findByCategory(category: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPublished: boolean;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        publishedAt: Date;
        authorId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPublished: boolean;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        publishedAt: Date;
        authorId: string;
    }>;
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        isPublished: boolean;
        excerpt: string | null;
        imageUrl: string | null;
        category: string;
        publishedAt: Date;
        authorId: string;
    }>;
    remove(id: string): Promise<void>;
}
