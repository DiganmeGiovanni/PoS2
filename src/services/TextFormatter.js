
class TextFormatter {

  static asMoney(value) {
    return '$ ' + Number(value).toFixed(2);
  }
}

export default TextFormatter;
