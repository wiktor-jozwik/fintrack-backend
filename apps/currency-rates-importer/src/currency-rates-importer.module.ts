import { Module } from '@nestjs/common';
import { ImporterModule } from './modules/import/importer.module';
import { PrismaModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('test', 'development', 'staging', 'production')
          .default('development'),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    PrismaModule,
    ImporterModule,
  ],
})
export class CurrencyRatesImporterModule {}
