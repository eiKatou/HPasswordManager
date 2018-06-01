const crypto = require("crypto");

class MasterPassword {
  constructor(password) {
    this._password = password;
  }
  
  getHash() {
    var sha512 = crypto.createHash('sha512');
    sha512.update(this.password);
    return sha512.digest('base64');
  }

  isEqualToHash(expectedHash) {
    return this.getHash() == expectedHash;
  }

  get password() {
    return this._password;
  }

  debugPrint() {
    console.log('master password:' + this.password);
  }
}

module.exports = MasterPassword;