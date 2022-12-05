import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

interface RmqModuleOptions {
  name: string;
}

@Module({})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URL') || ''],
                queue: configService.get<string>(`RABBITMQ_${name}_QUEUE`),
                queueOptions: {
                  durable: false,
                },
              },
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
