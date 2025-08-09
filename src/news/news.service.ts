
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { News } from '@prisma/client';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';


@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto, authorId: string): Promise<News> {
    return this.prisma.news.create({
      data: {
        ...createNewsDto,
        authorId,
      },
    });
  }

async findAll(
  page: number | string = 1,
  limit: number | string = 10,
  category?: string,
  search?: string,
): Promise<{ data: News[]; total: number; page: number; limit: number }> {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const where: any = { isPublished: true };

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
      include: { author: true },
    }),
    this.prisma.news.count({ where }),
  ]);

  return { data, total, page: pageNumber, limit: limitNumber };
}


  async findOne(id: string): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!news || !news.isPublished) {
      throw new NotFoundException('News article not found');
    }
    return news;
  }

  async findFeatured(limit: number = 5): Promise<News[]> {
    return this.prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: { author: true },
    });
  }

  async findByCategory(category: string): Promise<News[]> {
    return this.prisma.news.findMany({
      where: { category, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      include: { author: true },
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
      include: { author: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.news.delete({ where: { id } });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.news.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map(cat => cat.category);
  }
}