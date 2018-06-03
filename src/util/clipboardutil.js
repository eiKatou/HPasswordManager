class ClipboardUtil {

  /**
   * クリップボードに値をコピーします。Macのみ対応。
   * @param {string} data 
   */
  static copy(data) {
    const proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data);
    proc.stdin.end();
  }
}
module.exports = ClipboardUtil;