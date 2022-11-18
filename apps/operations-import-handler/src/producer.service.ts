import { Inject, Injectable } from '@nestjs/common';
import { OPERATIONS_IMPORT_SERVICE } from './constants/operations-import-service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
  constructor(
    @Inject(OPERATIONS_IMPORT_SERVICE)
    private readonly importClient: ClientProxy,
  ) {}

  produce(payload: any) {
    this.importClient.emit('import-operations', payload);
  }
}
