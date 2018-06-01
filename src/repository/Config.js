class Config {
  constructor(masterPasswordHash) {
    this.masterPasswordHash = masterPasswordHash;
  }

  print() {
    console.log('master password hash:' + this.masterPasswordHash);
  }
}

module.exports = Config;