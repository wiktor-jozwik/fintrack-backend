import * as moment from 'moment';

export const isValidIsoDate = (date: string | Date) => {
  return moment(date, 'YYYY-MM-DD', true).isValid();
};
