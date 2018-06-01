const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./domain/Item');
const ItemRepository = require('./ItemRepository');

// ------------
//   function
// ------------
function addItem() {
  let name = readlineSync.question(' Item name:');
  let siteAddress = readlineSync.question(' Site address:');
  let id = readlineSync.question(' Id:');
  let password = readlineSync.question(' Password:');
  return new Item(name, siteAddress, id, password);
}

function searchItem(items, searchWord) {
  let item = items.find((item) => {
    return item.isSubjectToSearch(searchWord);
  });
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
    let item = addItem(items);
    items.push(item);
    ItemRepository.write(items);
    console.log();
  } else if (command == 's' || command == 'search') {
    let searchWord = readlineSync.question(' search: ');
    let item = searchItem(items, searchWord);
    if (item == undefined) {
      break;
    }
    console.log();
    itemCommand(item);
    console.log();    
  }
}
