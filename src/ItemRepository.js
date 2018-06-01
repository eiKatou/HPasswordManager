const fs = require('fs');
const Item = require('./domain/Item');
const EncryptedItem = require('./EncryptedItem');
const EncryptedUtil = require('./util/EncryptUtil');
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const dataFilePath = homeDir + '/.hpassword_data';

class ItemRepository {
  static init() {
    try {
      fs.accessSync(dataFilePath, fs.constants.R_OK | fs.constants.W_OK);

      // 手動で空ファイルにされる場合を考慮
      let data = fs.readFileSync(dataFilePath);
      if (data == '') {
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
      }
    } catch (err) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
  }

  static load(masterPassword) {
    let data = fs.readFileSync(dataFilePath);
    return JSON.parse(data).map(function(element, index, array) {
      let password = EncryptedUtil.decrypt(element.encryptedPassword, masterPassword);
      return new Item(element.name, element.site, element.id, password);
    });
  }

  static write(items, masterPassword) {
    let encryptedItems = items.map(function(element, index, array) {
      let encryptedPassword = EncryptedUtil.encrypt(element.password, masterPassword);
      return new EncryptedItem(element.name, element.site, element.id, encryptedPassword);
    });
    fs.writeFileSync(dataFilePath, JSON.stringify(encryptedItems, null, 2));
  }
}

module.exports = ItemRepository;