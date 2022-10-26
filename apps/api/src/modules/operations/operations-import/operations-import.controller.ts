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
import { diskStorage } from 'multer';
import { OperationsImportService } from './domain';
import { ImportOperationsDto } from './dto';
import { Public, SkipUserActiveCheck, UserId } from '@api/common/decorators';
import { StringResponse } from '@api/common/interfaces';

@Controller('operations_import')
export class OperationsImportController {
  constructor(
    private readonly operationsImportService: OperationsImportService,
  ) {}

  @Public()
  @SkipUserActiveCheck()
  @Get('supported_csv_ways')
  getSupportedCsvWays() {
    return this.operationsImportService.getSupportedCsvWays();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          callback,
        ) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
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
    await this.operationsImportService.import(
      file.path,
      userId,
      importOperationsDto,
    );

    return {
      response: `'${file.originalname}' queued`,
    };
  }
}
