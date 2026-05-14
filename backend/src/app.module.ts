import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ArticleModule } from './article/article.module'
import { AttachmentModule } from './attachment/attachment.module'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import authConfig from './config/auth.config'
import cookiesConfig from './config/cookies.config'
import { PrismaModule } from './prisma/prisma.module'
import { S3Module } from './s3/s3.module'
import { TokenModule } from './token/token.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, cookiesConfig],
    }),
    PrismaModule,
    TokenModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ArticleModule,
    S3Module,
    AttachmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
