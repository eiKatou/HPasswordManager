const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./Item');

function addItem() {
  let name = readlineSync.question('Item name:');
  let siteAddress = readlineSync.question('Site address:');
  let id = readlineSync.question('Id:');
  let password = readlineSync.question('Password:');
  let item = new Item(name, siteAddress, id, password);
  let items = readItems();
  items.push(item);
  fs.writeFileSync(dataFilePath, JSON.stringify(items));
}

function searchItem(searchWord) {
  let items = readItems();
  let item = findItem(items, searchWord);
  if (item == undefined) {
    console.log('Item not found.');
    return;
  }

  console.log('Item:' + item.name);

  for(;;) {
    let command = readlineSync.question('command: ');
    if (command == 'q' || command == 'quit') {
      break;
    } else if (command == 's' || command == 'show') {
      item.print();
    } else if (command == 'i' || command == 'id') {
      console.log(item.id);
    } else if (command == 'p' || command == 'password') {
      console.log(item.password);
    }
  }
}

function init() {
  try {
    fs.accessSync(dataFilePath, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
}

function findItem(items, word) {
  return items.find((item) => {
    return item.name == word || item.site == word;
  });
}

function readItems() {
  let data = fs.readFileSync(dataFilePath);
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
const homeDir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
const dataFilePath = homeDir + '/.hpassword_data';
init();
if (arg1 == '-a' || arg1 == '--add') {
  addItem();
} else if (arg1 == '-s' || arg1 == '--search') {
  searchItem(arg2);
} else {
  // TODO:help
}