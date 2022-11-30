export const CsvImporterMock = {
  setReader: jest.fn().mockImplementation(),
  import: jest.fn().mockImplementation(),
  saveOperation: jest.fn().mockImplementationOnce(() => Promise.resolve()),
};
