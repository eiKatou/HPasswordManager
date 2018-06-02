const crypto = require("crypto"),
      algorithm = 'aes-256-ctr',
      beforeEncoding = 'utf8',
      afterEncoding = 'base64',
      SALT_LENGTH = 128;

class EncryptedUtil {
  static encrypt(clearText, password, salt) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(clearText + salt, beforeEncoding, afterEncoding);
    crypted += cipher.final(afterEncoding);
    return crypted;
  }

  static decrypt(encryptedText, password, salt) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(encryptedText, afterEncoding, beforeEncoding);
    dec += decipher.final(beforeEncoding);
    return dec.substring(0, dec.length - salt.length);
  }

  static generateSalt() {
    return crypto.randomBytes(SALT_LENGTH)
      .toString('hex')
      .slice(0, SALT_LENGTH);
  }
}

module.exports = EncryptedUtil;