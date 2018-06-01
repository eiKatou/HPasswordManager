const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./Item');
const ItemRepository = require('./ItemRepository');

function addItem(items) {
  let name = readlineSync.question(' Item name:');
  let siteAddress = readlineSync.question(' Site address:');
  let id = readlineSync.question(' Id:');
  let password = readlineSync.question(' Password:');
  let item = new Item(name, siteAddress, id, password);
  items.push(item);
}

function searchItem(items, searchWord) {
  let item = findItem(items, searchWord);
  if (item == undefined) {
    console.log('Item not found.');
    return;
  }
  return item;
}

function itemCommand(item) {
  for(;;) {
    let command = readlineSync.question(item.name + ' command: ');
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

function unlock() {
  let masterPassword = readlineSync.question('password: ');
  if (masterPassword == 'ppp') {
    return true;
  }
  return false;
}

function findItem(items, word) {
  return items.find((item) => {
    return item.name == word || item.site == word;
  });
}

// ------------
//   main
// ------------
ItemRepository.init();
let isUnlock = unlock();
if (!isUnlock) {
  console.log('Invalid password.');
  return;
}
console.log();

let items = ItemRepository.load();
for(;;) {
  let command = readlineSync.question('command: ');
  if (command == 'q' || command == 'quit') {
    break;
  } else if (command == 'a' || command == 'add') {
    addItem(items); // TODO:副作用ありなので要修正
    ItemRepository.write(items);
    console.log();
  } else if (command == 's' || command == 'search') {
    let searchWord = readlineSync.question('search: ');
    let item = searchItem(items, searchWord);
    if (item == undefined) {
      break;
    }
    console.log();
    itemCommand(item);
    console.log();    
  }
}
