import * as moment from 'moment/moment';

export const convertDatetimeToDate = (date: Date): string => {
  return moment(date).format(moment.HTML5_FMT.DATE);
};
