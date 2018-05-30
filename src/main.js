const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./Item');

function addItem() {
  let name = readlineSync.question('Item name:');
  let siteAddress = readlineSync.question('Site address:');
  let item = new Item(name, siteAddress);
  let items = readItems();
  items.push(item);
  fs.writeFileSync('test.txt', JSON.stringify(items));
}

function searchItem(searchWord) {
  let items = readItems();
  let item = findItem(items, searchWord);
  item.print();
  // TODO:アイテム名を見せて、パスワードを表示するコマンドを受け取る
}

function init() {
  try {
    fs.accessSync('test.txt', fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    fs.writeFileSync('test.txt', JSON.stringify([]));
  }
}

function findItem(items, word) {
  return items.find((item) => {
    return item.name == word || item.site == word;
  });
}

function readItems() {
  let data = fs.readFileSync("test.txt");
  if (data == '') {
    return [];
  }
  return JSON.parse(data).map(function(element, index, array) {
    return new Item(element.name, element.site);
  });
}

// ------------
//   main
// ------------
const arg1 = process.argv[2];
const arg2 = process.argv[3];
init();
if (arg1 == '-a' || arg1 == '--add') {
  addItem();
} else if (arg1 == '-s' || arg1 == '--search') {
  searchItem(arg2);
} else {
  // TODO:help
}