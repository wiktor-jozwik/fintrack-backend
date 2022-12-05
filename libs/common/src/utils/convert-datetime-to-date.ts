import * as moment from 'moment';

export const convertDatetimeToDate = (date: Date): string => {
  return moment(date).format(moment.HTML5_FMT.DATE);
};
