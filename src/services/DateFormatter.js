
class DateFormatter {

  /**
   *
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
}

export default DateFormatter;
