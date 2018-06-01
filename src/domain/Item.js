class Item {
  constructor(name, site, id, password) {
    this.name = name;
    this.site = site;
    this.id = id;
    this.password = password;
  }
  
  isSubjectToSearch(searchWord) {
    return this.name.toLowerCase().includes(searchWord.toLowerCase())
       || this.site.toLowerCase().includes(searchWord.toLowerCase());
  }

  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;