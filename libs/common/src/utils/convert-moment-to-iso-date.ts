import * as moment from 'moment'

export const convertMomentToIsoDate = (momentDate: moment.Moment | Date): string =>
  moment(momentDate).format('YYYY-MM-DD');
