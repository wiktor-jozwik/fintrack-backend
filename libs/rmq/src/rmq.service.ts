import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, prefetchCount = 1000, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URL') || ''],
        queue: this.configService.get<string>(`RABBITMQ_${queue}_QUEUE`),
        queueOptions: {
          durable: false,
        },
        prefetchCount,
        noAck,
      },
    };
  }
}
