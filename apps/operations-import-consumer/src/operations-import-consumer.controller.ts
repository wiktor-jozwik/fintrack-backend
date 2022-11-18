import { Controller } from '@nestjs/common';
import { OperationsImportConsumerService } from './operations-import-consumer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class OperationsImportConsumerController {
  constructor(
    private readonly operationsImporterConsumerService: OperationsImportConsumerService,
  ) {}

  @EventPattern('import-operations')
  async handleImportOperations(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('consuming');
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      console.log(payload);
      channel.ack(message);
    } catch (e) {
      channel.nack(message);
      throw e;
    }
  }
}
