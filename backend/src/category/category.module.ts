import { Module } from '@nestjs/common'

import { ArticleModule } from '@/article/article.module'
import { TokenModule } from '@/token/token.module'

import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  imports: [TokenModule, ArticleModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
