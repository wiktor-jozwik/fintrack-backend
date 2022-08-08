import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from '@hapi/joi';
import { AuthModule } from './modules/auth/auth.module';
import { OperationsModule } from './modules/operations/operations.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        APP_PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    OperationsModule,
    CategoriesModule,
    CurrenciesModule,
  ],
  controllers: [AuthController],
})
export class AppModule {}
