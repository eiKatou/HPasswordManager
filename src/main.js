const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./domain/Item');
const ItemRepository = require('./ItemRepository');
const Config = require('./Config');
const ConfigRepository = require('./ConfigRepository');
const MasterPassword = require('./domain/MasterPassword');

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

function validateMasterPassword(config, masterPassword) {
  if (config.masterPasswordHash == masterPassword.getHash()) {
    return true;
  }
  return false;
}

// ------------
//   main
// ------------
ItemRepository.init();
ConfigRepository.init();

// 設定ファイルの読み込み
let config = ConfigRepository.load();
if (config == null) {
  // マスターパスワードの初期設定
  let inputNewMasterPassword = readlineSync.question(' new master password: ');
  let newMasterPassword = new MasterPassword(inputNewMasterPassword);
  let newConfig = new Config(newMasterPassword.getHash());
  ConfigRepository.write(newConfig);
  console.log('Success. Save your master password. Restart this application.');
  return;
}

// マスターパスワードの入力と生成
let inputMasterPassword = readlineSync.question(' master password: ');
let masterPassword = new MasterPassword(inputMasterPassword);
if (!validateMasterPassword(config, masterPassword)) {
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
      console.log(' Item not found.');
      continue;
    }
    console.log();
    itemCommand(item);
    console.log();    
  }
}
