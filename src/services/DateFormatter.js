
class DateFormatter {

  /**
   * Returns given date formatted as 'yyyy-mm-dd'
   * @param {Date} value
   * @returns {string}
   */
  static asDateOnly(value) {
    if (value) {
      const year = value.getFullYear();
      const month = value.getMonth() < 10
        ? '0' + (value.getMonth() + 1)
        : value.getMonth() + 1;
      const day = value.getDate() < 10
        ? '0' + value.getDate()
        : value.getDate();

      return `${ year }-${ month }-${ day }`;
    }

    return '';
  }

  /**
   * Takes a string 'yyyy-mm-dd HH:mm:ss' and parse
   * into a date
   * @param {string} value
   * @returns {Date}
   */
  static parse(value) {
    const parts = value.split(" ");
    const ymdParts = parts[0].split("-");
    const hmsParts = parts[1].split(":");

    const year = ymdParts[0] * 1;
    const month = ymdParts[1] * 1 - 1;
    const date = ymdParts[2] * 1;
    const hour = hmsParts[0] * 1;
    const mins = hmsParts[1] * 1;
    const secs = hmsParts[2].split(".")[0] * 1;
    return new Date(year, month, date, hour, mins, secs);
  }
}

export default DateFormatter;
