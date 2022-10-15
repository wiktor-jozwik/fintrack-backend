import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { OperationsModule } from './modules/operations/operations/operations.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { UsersCurrenciesModule } from './modules/users-currencies/users-currencies.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import LogsMiddleware from './common/middlewares/logs.middleware';
import { EmailModule } from './modules/email/email.module';
import { OperationsImportModule } from './modules/operations/operations-import/operations-import.module';
import { OperationsCalculatorModule } from './modules/operations/operations-calculator/operations-calculator.module';

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
        PORT: Joi.number().required(),
        API_URL: Joi.string().required(),
        JWT_AT_SECRET: Joi.string().required(),
        JWT_AT_EXPIRATION_TIME: Joi.string().required(),
        JWT_RT_SECRET: Joi.string().required(),
        JWT_RT_EXPIRATION_TIME: Joi.string().required(),
        JWT_USER_EMAILS_TOKEN_SECRET: Joi.string().required(),
        JWT_USER_EMAILS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OperationsModule,
    CategoriesModule,
    CurrenciesModule,
    UsersCurrenciesModule,
    EmailModule,
    OperationsImportModule,
    OperationsCalculatorModule,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
