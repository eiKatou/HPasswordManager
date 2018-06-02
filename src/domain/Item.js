const EncryptedUtil = require('../util/EncryptUtil');

class Item {
  constructor(name, site, id, encryptedPassword, salt) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.encryptedPassword = encryptedPassword;
    this.salt = salt;
  }

  static create(name, site, id, password, masterPassword) {
    const salt = EncryptedUtil.generateSalt();
    return new Item(name, site, id, 
      EncryptedUtil.encrypt(password, masterPassword, salt), 
      salt);
  }
  
  isSubjectToSearch(searchWord) {
    return this.name.toLowerCase().includes(searchWord.toLowerCase())
       || this.site.toLowerCase().includes(searchWord.toLowerCase());
  }

  getPassword(masterPassword) {
    return EncryptedUtil.decrypt(this.encryptedPassword, masterPassword, this.salt);
  }

  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;