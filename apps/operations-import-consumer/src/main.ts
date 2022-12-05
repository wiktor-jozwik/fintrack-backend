import { NestFactory } from '@nestjs/core';
import { OperationsImportConsumerModule } from './operations-import-consumer.module';
import { RmqService } from '@app/rmq';

async function bootstrap() {
  const app = await NestFactory.create(OperationsImportConsumerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('OPERATIONS_IMPORT'));

  await app.startAllMicroservices();
}
bootstrap();
