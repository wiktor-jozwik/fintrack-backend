import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

@Injectable()
export class AzureBlobStorageService {
  private readonly containerName: string;
  constructor(private readonly configService: ConfigService) {
    this.containerName =
      configService.get<string>('OPERATIONS_IMPORT_AZURE_CONTAINER_NAME') || '';
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${randomUUID()}-${file.originalname}`;
    const blobClient = await this.getBlobClient(fileName);

    await blobClient.uploadData(file.buffer);

    return fileName;
  }

  async downloadFile(directory: string, fileName: string) {
    const blobClient = await this.getBlobClient(fileName);

    return await blobClient.downloadToFile(`${directory}/${fileName}`);
  }

  async deleteFile(fileName: string) {
    const blobClient = await this.getBlobClient(fileName);

    return await blobClient.deleteIfExists();
  }

  private async getBlobClient(fileName: string) {
    const blobServiceClient = await this.getBlobServiceInstance();
    const containerClient = blobServiceClient.getContainerClient(
      this.containerName,
    );

    return containerClient.getBlockBlobClient(fileName);
  }

  private async getBlobServiceInstance() {
    return BlobServiceClient.fromConnectionString(
      this.configService.get('AZURE_BLOB_STORAGE_CONNECTION_STRING') || '',
    );
  }
}
