const fs = require('fs');
const Config = require('./Config');
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const dataFilePath = homeDir + '/.hpassword.config';

class ConfigRepository {
  static init() {
    try {
      fs.accessSync(dataFilePath, fs.constants.R_OK | fs.constants.W_OK);

      // 手動で空ファイルにされる場合を考慮
      let data = fs.readFileSync(dataFilePath);
      if (data == '') {
        fs.writeFileSync(dataFilePath, JSON.stringify({}));
      }
    } catch (err) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}));
    }
  }

  static load() {
    let data = fs.readFileSync(dataFilePath);
    let configData = JSON.parse(data);
    if (configData.masterPasswordHash == undefined) {
      return null;
    }
    return new Config(configData.masterPasswordHash, configData.masterPasswordSalt);
  }

  static save(config) {
    fs.writeFileSync(dataFilePath, JSON.stringify(config, null, 2));
  }
}

module.exports = ConfigRepository;