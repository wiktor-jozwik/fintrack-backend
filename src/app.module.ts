import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './database/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';
import { UsersController } from './modules/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        APP_PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
