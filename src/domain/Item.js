const EncryptedUtil = require('../util/EncryptUtil');

class Item {
  constructor(name, site, id, encryptedPassword, iv) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.encryptedPassword = encryptedPassword;
    this.iv = iv;
  }

  static create(name, site, id, password, masterPassword) {
    const iv = EncryptedUtil.generateIv();
    return new Item(name, site, id, 
      EncryptedUtil.encrypt(password, masterPassword.getHash32Byte(), iv), 
      iv);
  }
  
  isSubjectToSearch(searchWord) {
    return this.name.toLowerCase().includes(searchWord.toLowerCase())
       || this.site.toLowerCase().includes(searchWord.toLowerCase());
  }

  getPassword(masterPassword) {
    return EncryptedUtil.decrypt(this.encryptedPassword, masterPassword.getHash32Byte(), this.iv);
  }
}

module.exports = Item;