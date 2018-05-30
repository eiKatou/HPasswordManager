class Item {
  constructor(name, site) {
    this.name = name;
    this.site = site;
  }
  
  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;