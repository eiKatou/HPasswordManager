#!/usr/bin/env node

// lib
const readlineSync = require('readline-sync');
const fs = require('fs');
// domain
const Item = require('./domain/Item');
const MasterPassword = require('./domain/MasterPassword');
// repository
const ItemRepository = require('./repository/ItemRepository');
const Config = require('./repository/Config');
const ConfigRepository = require('./repository/ConfigRepository');
// view
const CommandView = require('./view/commandview');
// util
const ClipboardUtil = require('./util/clipboardutil');

// ------------
//   function
// ------------

/**
 * アイテムを検索します
 * @param {Item[]} items 
 * @param {String} searchWord 
 * @returns {Item[]}
 */
function searchItem(items, searchWord) {
  return items.filter((item) => {
    return item.isSubjectToSearch(searchWord);
  });
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
      ClipboardUtil.copy(item.getPassword(masterPassword));
      console.log('Copied to clipboard.');
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
// TODO:この中身をViewに移す
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
const addFunction = (name, siteAddress, id, password) => {
  const item = Item.create(name, siteAddress, id, password, masterPassword);
  items.push(item);
  ItemRepository.save(items);
  console.log();　// TODO:consoleの整形はViewで
};
const searchFunction = (searchWord) => {
  // TODO:この中身をViewに移すべきか
  let foundItems = searchItem(items, searchWord);
  if (foundItems.length == 0) {
    console.log(' Item not found.');
    return;
  }
  if (foundItems.length > 1) {
    console.log(foundItems.length + ' items.');
    foundItems.forEach((item) => {
      item.print();
    });
    return;
  }
  console.log();
  itemCommand(foundItems[0], masterPassword);
  console.log();  
};

CommandView.readCommand(addFunction, searchFunction);

