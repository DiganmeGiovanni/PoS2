import moment from 'moment';

class DateService {

  /**
   * Generates a SQL fragment that transforms given field
   * from UTC to local time (Subtracts 5 hours).
   *
   * For example, if given field is 'purchase_date', returned
   * statement will be:
   * "strftime('%Y-%m-%d %H:%M:%S', datetime(purchase_date, '-5 hours'))"
   *
   * @param {string} field Fields to transform from UTC to local
   */
  static fromSQLiteUtcToLocal(field) {
    return `strftime('%Y-%m-%d %H:%M:%S', datetime(${field}, '-5 hours'))`
  }

  /**
   * Formats given date as 'yyyy-mm-dd 00:00:00'
   * NOTE: If concat23_59 is true then hour time will be
   * '23:59:59'
   *
   * @param {Date} date Date to format
   * @param {boolean} contact23_59 Indicate if to use '23:59:59' as time part
   */
  static formatForSQLQuery(date, contact23_59) {
    let fDate = moment(date).format('YYYY-MM-DD');
    if (contact23_59) {
      fDate += ' 23:59:59';
    } else {
      fDate += ' 00:00:00';
    }

    return fDate;
  }
}

export default DateService
