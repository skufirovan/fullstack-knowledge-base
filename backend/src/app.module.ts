import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import authConfig from './config/auth.config'
import { PrismaModule } from './prisma/prisma.module'
import { TokenModule } from './token/token.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    PrismaModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
