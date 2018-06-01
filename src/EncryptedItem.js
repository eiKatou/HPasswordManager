class EncryptedItem {
  // TODO:Itemにまとめられないか？逆にまとめないほうがいい？継承にする？
  constructor(name, site, id, encryptedPassword) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.encryptedPassword = encryptedPassword;
  }
}

module.exports = EncryptedItem;