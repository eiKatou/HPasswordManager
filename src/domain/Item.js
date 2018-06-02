const EncryptedUtil = require('../util/EncryptUtil');

class Item {
  constructor(name, site, id, encryptedPassword) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.encryptedPassword = encryptedPassword;
  }

  static create(name, site, id, password, masterPassword) {
    return new Item(name, site, id, EncryptedUtil.encrypt(password, masterPassword));
  }
  
  isSubjectToSearch(searchWord) {
    return this.name.toLowerCase().includes(searchWord.toLowerCase())
       || this.site.toLowerCase().includes(searchWord.toLowerCase());
  }

  getPassword(masterPassword) {
    return EncryptedUtil.decrypt(this.encryptedPassword, masterPassword);
  }

  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;