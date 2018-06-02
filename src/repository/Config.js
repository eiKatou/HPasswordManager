class Config {
  constructor(masterPasswordHash, salt) {
    this.masterPasswordHash = masterPasswordHash;
    this.masterPasswordSalt = salt;
  }

  print() {
    console.log('master password hash:' + this.masterPasswordHash);
  }
}

module.exports = Config;