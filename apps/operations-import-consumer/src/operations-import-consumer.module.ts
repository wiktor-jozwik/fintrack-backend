import { Module } from '@nestjs/common';
import { OperationsImportConsumerController } from './operations-import-consumer.controller';
import { OperationsImportConsumerService } from './operations-import-consumer.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqService } from '@app/rmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_OPERATIONS_IMPORT_QUEUE: Joi.string().required(),
      }),
    }),
  ],
  controllers: [OperationsImportConsumerController],
  providers: [OperationsImportConsumerService, RmqService],
})
export class OperationsImportConsumerModule {}
