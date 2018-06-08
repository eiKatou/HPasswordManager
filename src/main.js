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
const MasterPasswordView = require('./view/masterpasswordview');
const CommandView = require('./view/commandview');
const ItemView = require('./view/itemview');
// util
const ClipboardUtil = require('./util/clipboardutil');

// ------------
//   main
// ------------
ItemRepository.init();
ConfigRepository.init();

// 設定ファイルの読み込み
let config = ConfigRepository.load();
if (config == null) {
  // マスターパスワードの初期設定
  MasterPasswordView.settingInitPassword((inputMasterPassword) => {
    let newMasterPassword = MasterPassword.create(inputMasterPassword);
    let config = new Config(newMasterPassword.getHash(), newMasterPassword.salt);
    ConfigRepository.save(config);
  });
  return;
}

// マスターパスワードの入力と生成
let inputMasterPassword = MasterPasswordView.readMasterPassword();
let masterPassword = new MasterPassword(inputMasterPassword, config.masterPasswordSalt);
if (!masterPassword.validate(config.masterPasswordHash)) {
  MasterPasswordView.showInvalidMasterPassword();
  return;
}

// アイテムの読み込み
let items = ItemRepository.load();

// ユーザからの指示による操作（アイテムを追加する時の処理）
const addAction = (name, siteAddress, id, password) => {
  const item = Item.create(name, siteAddress, id, password, masterPassword);
  items.push(item);
  ItemRepository.save(items);
};
// ユーザからの指示による操作（アイテムを検索する時の処理）
const searchAction = (searchWord) => {
  let foundItems = items.filter((item) => {
    return item.isSubjectToSearch(searchWord);
  });
  if (foundItems.length == 0) {
    CommandView.showItemNotFound();
    return;
  }
  if (foundItems.length > 1) {
    CommandView.showManyItemsFound(foundItems);
    return;
  }
  // アイテムが見つかったので、アイテムに対する操作を受け付ける
  ItemView.readCommand(foundItems[0], (item) => {
    ClipboardUtil.copy(item.getPassword(masterPassword));
  });
};

// ユーザからの指示を受け付ける
CommandView.readCommand(addAction, searchAction);

