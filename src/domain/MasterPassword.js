const crypto = require("crypto");
const EncryptedUtil = require('../util/EncryptUtil');

class MasterPassword {
  constructor(password, salt) {
    this._password = password;
    this._salt = salt;
  }
  
  static create(password) {
    const salt = EncryptedUtil.generateSalt();
    return new MasterPassword(password, salt);
  }

  getHash() {
    return crypto.pbkdf2Sync(this.password, this.salt, 50000, 512, 'sha512')
      .toString('base64');
  }

  getHash32Byte() {
    return crypto.pbkdf2Sync(this.password, this.salt, 10000, 32, 'sha512')
      .toString('base64')
      .slice(0, 32);
  }

  validate(expectedHash) {
    return this.getHash() == expectedHash;
  }

  get password() {
    return this._password;
  }
  get salt() {
    return this._salt;
  }
  debugPrint() {
    console.log('master password:' + this.password);
  }
}

module.exports = MasterPassword;