class Config {
  constructor(masterPasswordHash) {
    this._masterPasswordHash = masterPasswordHash;
  }

  get masterPasswordHash() {
    return this._masterPasswordHash;
  }

  print() {
    console.log('master password hash:' + this.masterPasswordHash);
  }
}

module.exports = Config;