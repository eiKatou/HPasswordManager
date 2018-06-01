const crypto = require("crypto"),
      algorithm = 'aes-256-ctr',
      beforeEncoding = 'utf8',
      afterEncoding = 'base64';

class EncryptedUtil {
  static encrypt(clearText, password) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(clearText, beforeEncoding, afterEncoding);
    crypted += cipher.final(afterEncoding);
    return crypted;
  }

  static decrypt(encryptedText, password) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(encryptedText, afterEncoding, beforeEncoding);
    dec += decipher.final(beforeEncoding);
    return dec;
  }
}

module.exports = EncryptedUtil;