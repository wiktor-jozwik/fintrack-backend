import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { OperationsModule } from './modules/operations/operations.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { UsersCurrenciesModule } from './modules/users-currencies/users-currencies.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('test', 'development', 'staging', 'production')
          .default('development'),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OperationsModule,
    CategoriesModule,
    CurrenciesModule,
    UsersCurrenciesModule,
  ],
})
export class AppModule {}
