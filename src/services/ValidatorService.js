import validator from 'validator';

class DValidator {

  /**
   * Given input must be a valid name
   * - More than or equal to two chars
   * - input will be trimmed before validate
   * @param input String to validate
   */
  static isName(input) {
    const sInput = DValidator.forceToString(input);
    return validator.isLength(sInput, {
      min: 2,
      max: 100,
    });
  }

  static isNumber(input) {
    const sInput = DValidator.forceToString(input);
    return this.nonEmpty(sInput) && validator.isDecimal(sInput);
  }

  static isInt(input) {
    const sInput = DValidator.forceToString(input);
    return validator.isInt(sInput);
  }

  /**
   * Given input must be a non empty string
   * @param input String to validate
   * @returns {boolean} Validation result
   */
  static nonEmpty(input) {
    const sInput = DValidator.forceToString(input);
    return validator.isLength(sInput, { min: 1 });
  }

  static forceToString(input) {
    if (typeof input !== 'string') {
      return `${input}`;
    }

    return input;
  }
}

export default DValidator;
