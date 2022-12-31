import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportOperationsDto } from './dto';
import { Public, SkipUserActiveCheck, UserId } from '../../common/decorators';
import { StringResponse } from '@app/common/interfaces';
import { OperationsImportService } from './services';
import { AzureBlobStorageService } from '@app/azure-blob-storage';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('operations_import')
@Controller('operations_import')
export class OperationsImportController {
  constructor(
    private readonly azureBlobStorageService: AzureBlobStorageService,
    private readonly operationsImportService: OperationsImportService,
  ) {}

  @Public()
  @SkipUserActiveCheck()
  @Get('supported_csv_ways')
  getSupportedCsvWays() {
    return this.operationsImportService.getSupportedCsvWays();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importOperations(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: number,
    @Body() importOperationsDto: ImportOperationsDto,
  ): Promise<StringResponse> {
    try {
      const fileName = await this.azureBlobStorageService.uploadFile(file);

      this.operationsImportService.queueOperationsImportFile({
        fileName,
        userId,
        csvImportWay: importOperationsDto.csvImportWay,
      });
    } catch (err) {
      return {
        response: `ERR: ${err.message}`,
      };
    }

    return {
      response: `'${file.originalname}' queued`,
    };
  }
}
