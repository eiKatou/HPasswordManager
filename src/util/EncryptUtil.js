const crypto = require("crypto"),
      algorithm = 'aes-256-ctr',
      beforeEncoding = 'utf8',
      afterEncoding = 'base64',
      SALT_LENGTH = 128,
      IV_LENGTH = 16;

class EncryptedUtil {
  static encrypt(clearText, key, iv) { // keyは32文字必要。ivの倍必要なようだ。keyにはHash化したパスワードでも良いのかな
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    cipher.setAutoPadding(true);
    let crypted = cipher.update(clearText, beforeEncoding, afterEncoding);
    crypted += cipher.final(afterEncoding);
    return crypted;
  }

  static decrypt(encryptedText, key, iv) {
    const decipher = crypto.createCipheriv(algorithm, key, iv);
    decipher.setAutoPadding(true);
    let dec = decipher.update(encryptedText, afterEncoding, beforeEncoding);
    dec += decipher.final(beforeEncoding);
    return dec;
  }

  static generateIv() {
    return crypto.randomBytes(IV_LENGTH)
      .toString('hex')
      .slice(0, IV_LENGTH);
  }

  static generateSalt() {
    return crypto.randomBytes(SALT_LENGTH)
      .toString('hex')
      .slice(0, SALT_LENGTH);
  }
}

module.exports = EncryptedUtil;