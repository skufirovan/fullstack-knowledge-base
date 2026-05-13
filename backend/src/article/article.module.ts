import { Module } from '@nestjs/common'

import { TokenModule } from '@/token/token.module'

import { ArticleController } from './article.controller'
import { ArticlePolicy } from './article.policy'
import { ArticleService } from './article.service'

@Module({
  imports: [TokenModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticlePolicy],
  exports: [ArticlePolicy],
})
export class ArticleModule {}
