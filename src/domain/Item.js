class Item {
  constructor(name, site, id, password) {
    this._name = name;
    this._site = site;
    this._id = id;
    this._password = password;
  }
  
  isSubjectToSearch(searchWord) {
    return this.name.toLowerCase().includes(searchWord.toLowerCase())
       || this.site.toLowerCase().includes(searchWord.toLowerCase());
  }

  get name() {
    return this._name;
  }
  get site() {
    return this._site;
  }
  get id() {
    return this._id;
  }
  get password() {
    return this._password;
  }

  print() {
    console.log('name:' + this.name + ', site:' + this.site);
  }
}

module.exports = Item;