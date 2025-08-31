import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY,UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create news article' })
  create(@Body() createNewsDto: CreateNewsDto, @Request() req: any) {
    return this.newsService.create(createNewsDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.newsService.findAll(page, limit, category, search);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured news articles' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findFeatured(@Query('limit') limit?: number) {
    return this.newsService.findFeatured(limit);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all news categories' })
  getCategories() {
    return this.newsService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get news by category' })
  findByCategory(@Param('category') category: string) {
    return this.newsService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news article by ID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FACULTY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update news article' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete news article' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}