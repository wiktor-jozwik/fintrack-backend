import { NestFactory } from '@nestjs/core';
import { OperationsImportHandlerModule } from './operations-import-handler.module';

async function bootstrap() {
  const app = await NestFactory.create(OperationsImportHandlerModule);
  await app.listen(process.env.OPERATION_IMPORT_HANDLER_PORT || 3000);
}
bootstrap();
