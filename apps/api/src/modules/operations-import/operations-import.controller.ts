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
import { ImportOperationsDto } from './dto';
import { Public, SkipUserActiveCheck, UserId } from '../../common/decorators';
import { StringResponse } from '@app/common/interfaces';
import { OperationsImportService } from './services';

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
    this.operationsImportService.queueOperationsImportFile({
      url: file.path,
      userId,
      csvImportWay: importOperationsDto.csvImportWay,
    });

    return {
      response: `'${file.originalname}' queued`,
    };
  }
}
