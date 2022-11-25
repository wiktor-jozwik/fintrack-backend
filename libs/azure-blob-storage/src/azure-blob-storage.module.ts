import { Module } from '@nestjs/common';
import { AzureBlobStorageService } from './azure-blob-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AzureBlobStorageService],
  exports: [AzureBlobStorageService],
})
export class AzureBlobStorageModule {}
