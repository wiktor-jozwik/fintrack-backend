import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from '@app/database';
import { LogsMiddleware } from './common/middlewares';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard, UserIsActiveGuard } from '@app/common/guards';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { OperationsModule } from './modules/operations';
import { CategoriesModule } from './modules/categories';
import { CurrenciesModule } from './modules/currencies';
import { UsersCurrenciesModule } from './modules/users-currencies';
import { EmailModule } from './modules/email';
import { CurrencyRatesModule } from './modules/currency-rates';
import { JwtAccessTokenStrategy } from '@app/common/strategies';

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
        API_PORT: Joi.number().required(),
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
    AuthModule,
    UsersModule,
    OperationsModule,
    CategoriesModule,
    CurrenciesModule,
    UsersCurrenciesModule,
    EmailModule,
    CurrencyRatesModule,
  ],
  providers: [
    JwtAccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserIsActiveGuard,
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
