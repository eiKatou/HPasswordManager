const readlineSync = require('readline-sync');
const fs = require('fs');

class Item {
  constructor(name, site) {
    this.name = name;
    this.site = site;
  }
}

function addItem() {
  let name = readlineSync.question('Item name:');
  let siteAddress = readlineSync.question('Site address:');
  let item = new Item(name, siteAddress);
  let items = readItems();
  items.push(item);
  fs.writeFileSync('test.txt', JSON.stringify(items));
}

function searchItem() {

}

function init() {
  try {
    fs.accessSync('test.txt', fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    fs.writeFileSync('test.txt', JSON.stringify([]));
  }
}

function readItems() {
  let data = fs.readFileSync("test.txt");
  if (data == '') {
    return [];
  }
  return JSON.parse(data);
}

// ------------
//   main
// ------------
const arg1 = process.argv[2];
init();
if (arg1 === '-add') {
  addItem();
} else {
  searchItem();
}