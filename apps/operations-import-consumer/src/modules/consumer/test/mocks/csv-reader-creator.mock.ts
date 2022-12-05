import { csvReaderStub } from '../stubs/csv-reader.stub';

export const CsvReaderCreatorMock = {
  create: jest.fn().mockReturnValue(csvReaderStub()),
};
