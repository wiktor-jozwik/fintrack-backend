import { Test, TestingModule } from '@nestjs/testing';
import { FilesystemService, OperationsImportService } from '../../services';
import { AzureBlobStorageService } from '@app/azure-blob-storage';
import { CsvImporter } from '../../services/csv-import';
import { CsvReaderCreator } from '../../services/csv-import/csv-readers';
import { AzureBlobStorageServiceMock } from '@app/azure-blob-storage/test/mocks/azure-blob-storage.service.mock';
import { CsvImporterMock } from '../mocks/csv-importer.mock';
import { CsvReaderCreatorMock } from '../mocks/csv-reader-creator.mock';
import { OperationsImportPayload } from '@app/common/interfaces';
import { CsvImportWay } from '@app/common/enums';
import { FilesystemServiceMock } from '../mocks/filesystem.service.mock';
import { csvReaderStub } from '../stubs/csv-reader.stub';

describe('OperationsImportService', () => {
  let operationsImportService: OperationsImportService;
  let azureBlobStorageService: AzureBlobStorageService;
  let csvImporter: CsvImporter;
  let csvReaderCreator: CsvReaderCreator;
  let filesystemService: FilesystemService;

  const azureBlobStorageServiceMock = AzureBlobStorageServiceMock;
  const csvImporterMock = CsvImporterMock;
  const csvReaderCreatorMock = CsvReaderCreatorMock;
  const filesystemServiceMock = FilesystemServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsImportService,
        AzureBlobStorageService,
        CsvImporter,
        CsvReaderCreator,
        FilesystemService,
      ],
    })
      .overrideProvider(AzureBlobStorageService)
      .useValue(azureBlobStorageServiceMock)
      .overrideProvider(CsvImporter)
      .useValue(csvImporterMock)
      .overrideProvider(CsvReaderCreator)
      .useValue(csvReaderCreatorMock)
      .overrideProvider(FilesystemService)
      .useValue(filesystemServiceMock)
      .compile();

    operationsImportService = module.get<OperationsImportService>(
      OperationsImportService,
    );
    azureBlobStorageService = module.get<AzureBlobStorageService>(
      AzureBlobStorageService,
    );
    csvImporter = module.get<CsvImporter>(CsvImporter);
    csvReaderCreator = module.get<CsvReaderCreator>(CsvReaderCreator);
    filesystemService = module.get<FilesystemService>(FilesystemService);

    jest.clearAllMocks();
  });

  describe('processImport', () => {
    describe('when processImport is called', () => {
      let filePath: string;
      const operationsImportsPayload: OperationsImportPayload = {
        fileName: 'test.csv',
        userId: 5,
        csvImportWay: CsvImportWay.PEKAO,
      };

      beforeEach(async () => {
        filePath = `upload/${operationsImportsPayload.fileName}`;
        await operationsImportService.processImport(operationsImportsPayload);
      });

      it('should call azureBlobStorageService.downloadFile', () => {
        expect(azureBlobStorageService.downloadFile).toBeCalledWith(
          'upload',
          operationsImportsPayload.fileName,
        );
      });

      it('should call csvReaderCreator.create', () => {
        expect(csvReaderCreator.create).toBeCalledWith(
          operationsImportsPayload.csvImportWay,
        );
      });

      it('should call csvImporter.setReader', () => {
        expect(csvImporter.setReader).toBeCalledWith(csvReaderStub());
      });

      it('should call csvImporter.import', () => {
        expect(csvImporter.import).toBeCalledWith(
          filePath,
          operationsImportsPayload.userId,
        );
      });

      it('should call fileOperatorService.deleteFile', () => {
        expect(filesystemService.deleteFile).toBeCalledWith(filePath);
      });
    });
  });
});
