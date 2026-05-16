import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequireAuth } from '@/common/decorators/require-auth.decorator'
import type { RequestUser } from '@/common/types/fastify'

import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @RequireAuth('admin', 'editor')
  @Post()
  create(@CurrentUser('id') id: string, @Body() dto: CreateArticleDto) {
    return this.articleService.create(id, dto)
  }

  @RequireAuth()
  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query('categorySlug') categorySlug: string,
    @CurrentUser() user: RequestUser
  ) {
    return this.articleService.findOne(categorySlug, slug, user)
  }

  @RequireAuth('admin', 'editor')
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Query('categorySlug') categorySlug: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: RequestUser
  ) {
    return this.articleService.update(categorySlug, slug, dto, user)
  }

  @RequireAuth('admin', 'editor')
  @Delete(':slug')
  remove(
    @Param('slug') slug: string,
    @Query('categorySlug') categorySlug: string,
    @CurrentUser() user: RequestUser
  ) {
    return this.articleService.remove(categorySlug, slug, user)
  }
}
