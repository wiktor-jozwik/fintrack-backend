import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationsImportService } from './services';
import { OperationsImportPayload } from '@app/common/interfaces/operations-import-payload';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  constructor(
    private readonly operationsImportService: OperationsImportService,
  ) {}

  @EventPattern('import-operations')
  async handleImportOperations(
    @Payload() payload: OperationsImportPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.operationsImportService.processImport(payload);

      channel.ack(message);
    } catch (e) {
      this.logger.error('ERR: ', e.message);
      channel.nack(message);
      throw e;
    }
  }
}
