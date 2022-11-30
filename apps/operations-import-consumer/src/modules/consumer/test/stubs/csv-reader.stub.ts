import {
  CsvPekaoReader,
  CsvReader,
} from '../../services/csv-import/csv-readers';

export const csvReaderStub = (): CsvReader => {
  return new CsvPekaoReader();
};
