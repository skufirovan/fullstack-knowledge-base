import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { RequireAuth } from '@/common/decorators/require-auth.decorator'
import type { RequestUser } from '@/common/types/fastify'

import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RequireAuth('admin', 'editor')
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto)
  }

  @RequireAuth()
  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.categoryService.findAll(user)
  }

  @RequireAuth()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug)
  }

  @RequireAuth('admin', 'editor')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(slug, dto)
  }

  @RequireAuth('admin', 'editor')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug)
  }
}
