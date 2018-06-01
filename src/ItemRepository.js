const fs = require('fs');
const Item = require('./domain/Item');
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const dataFilePath = homeDir + '/.hpassword_data';

class ItemRepository {
  static init() {
    try {
      fs.accessSync(dataFilePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
  }

  static load() {
    let data = fs.readFileSync(dataFilePath);
    if (data == '') {
      return [];
    }
    return JSON.parse(data).map(function(element, index, array) {
      return new Item(element.name, element.site, element.id, element.password);
    });
  }

  static write(items) {
    fs.writeFileSync(dataFilePath, JSON.stringify(items));
  }
}

module.exports = ItemRepository;