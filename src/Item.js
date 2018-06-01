class Item {
  constructor(name, site, id, password) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.password = password;
  }
  
  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;