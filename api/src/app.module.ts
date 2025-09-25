import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { GroceryModule } from './grocery/grocery.module'
import { AuthModule } from './auth/auth.module'
import config from './config'

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', `.env.${process.env.NODE_ENV}.local`, '.env.local'],
      isGlobal: true,
      load: [config],
    }),
    GroceryModule,
  ],
})
export class AppModule {}
