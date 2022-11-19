import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/database';
import { OperationsImportController } from './operations-import.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessTokenGuard, UserIsActiveGuard } from '@app/common/guards';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtAccessTokenStrategy } from '@app/common/strategies';
import { OPERATIONS_IMPORT_SERVICE } from './constants/operations-import-service';
import { RmqModule } from '@app/rmq';
import { OperationsImportService } from './operations-import.service';

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
        OPERATION_IMPORT_HANDLER_PORT: Joi.number().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_OPERATIONS_IMPORT_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({ name: OPERATIONS_IMPORT_SERVICE }),
  ],
  providers: [OperationsImportService],
  controllers: [OperationsImportController],
})
export class OperationsImportModule {}
