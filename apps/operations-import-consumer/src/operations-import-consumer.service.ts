import { Injectable } from '@nestjs/common';

@Injectable()
export class OperationsImportConsumerService {
  getHello(): string {
    return 'Hello World!';
  }
}
