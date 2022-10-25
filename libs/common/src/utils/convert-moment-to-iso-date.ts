import { Moment } from 'moment';

export const convertMomentToIsoDate = (momentDate: Moment): string =>
  momentDate.format('YYYY-MM-DD');
