import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from '@app/database';
import { ConsumerModule } from './modules/consumer/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_OPERATIONS_IMPORT_QUEUE: Joi.string().required(),
        AZURE_BLOB_STORAGE_CONNECTION_STRING: Joi.string().required(),
        OPERATIONS_IMPORT_AZURE_CONTAINER_NAME: Joi.string().required(),
      }),
    }),
    ConsumerModule,
    PrismaModule,
  ],
})
export class OperationsImportConsumerModule {}
