import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<any>;
    findAll(page?: number, limit?: number, category?: string, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    findFeatured(limit?: number): Promise<any[]>;
    getCategories(): Promise<string[]>;
    findByCategory(category: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateNewsDto: UpdateNewsDto): Promise<any>;
    remove(id: string): Promise<void>;
}
