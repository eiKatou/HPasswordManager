const fs = require('fs');
const Config = require('./Config');
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const dataFilePath = homeDir + '/.hpassword.config';

class ConfigRepository {
  static init() {
    try {
      fs.accessSync(dataFilePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
  }

  static load() {
    let data = fs.readFileSync(dataFilePath);
    let configData = JSON.parse(data);
    // TODO:これはConfigに任せても良いのかも。masterPasswordHashで保存されることを知っているのはおかしい。
    if (configData.masterPasswordHash == undefined) {
      return null;
    }
    return new Config(configData.masterPasswordHash);
  }

  static write(config) {
    fs.writeFileSync(dataFilePath, JSON.stringify(config, null, 2));
  }
}

module.exports = ConfigRepository;