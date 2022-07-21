import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/users.module';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        APP_PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
