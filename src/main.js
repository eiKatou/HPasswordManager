const readlineSync = require('readline-sync');
const fs = require('fs');
const Item = require('./domain/Item');
const ItemRepository = require('./repository/ItemRepository');
const Config = require('./repository/Config');
const ConfigRepository = require('./repository/ConfigRepository');
const MasterPassword = require('./domain/MasterPassword');

// ------------
//   function
// ------------
function addItem(masterPassword) {
  let name = readlineSync.question(' Item name:');
  let siteAddress = readlineSync.question(' Site address:');
  let id = readlineSync.question(' Id:');
  let password = readlineSync.question(' Password:', {
    hideEchoBack: true
  });
  return Item.create(name, siteAddress, id, password, masterPassword);
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

function itemCommand(item, masterPassword) {
  for(;;) {
    let command = readlineSync.question(item.name + ' command: ');
    if (command == 'q' || command == 'quit') {
      break;
    } else if (command == 's' || command == 'show') {
      item.print();
    } else if (command == 'i' || command == 'id') {
      console.log(item.id);
    } else if (command == 'p' || command == 'password') {
      console.log(item.getPassword(masterPassword));
    }
  }
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
  let inputNewMasterPassword = readlineSync.question(' new master password: ', {
    hideEchoBack: true
  });
  let newMasterPassword = MasterPassword.create(inputNewMasterPassword);
  let newConfig = new Config(newMasterPassword.getHash(), newMasterPassword.salt);
  ConfigRepository.save(newConfig);
  console.log('Success. Save your master password. Restart this application.');
  return;
}

// マスターパスワードの入力と生成
let inputMasterPassword = readlineSync.question(' master password: ', {
  hideEchoBack: true
});
let masterPassword = new MasterPassword(inputMasterPassword, config.masterPasswordSalt);
if (!masterPassword.validate(config.masterPasswordHash)) {
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
    let item = addItem(masterPassword.password);
    items.push(item);
    ItemRepository.save(items);
    console.log();
  } else if (command == 's' || command == 'search') {
    let searchWord = readlineSync.question(' search: ');
    let item = searchItem(items, searchWord);
    if (item == undefined) {
      console.log(' Item not found.');
      continue;
    }
    console.log();
    itemCommand(item, masterPassword.password);
    console.log();    
  }
}
