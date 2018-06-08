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
const ItemView = require('./view/itemview');
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

let items = ItemRepository.load();

const passwordFunction = (item) => {
  ClipboardUtil.copy(item.getPassword(masterPassword));
};
const addFunction = (name, siteAddress, id, password) => {
  const item = Item.create(name, siteAddress, id, password, masterPassword);
  items.push(item);
  ItemRepository.save(items);
};
const searchFunction = (searchWord) => {
  let foundItems = searchItem(items, searchWord);
  if (foundItems.length == 0) {
    CommandView.showItemNotFound();
    return;
  }
  if (foundItems.length > 1) {
    CommandView.showManyItemsFound(foundItems);
    return;
  }
  ItemView.readCommand(foundItems[0], passwordFunction);
};

CommandView.readCommand(addFunction, searchFunction);

