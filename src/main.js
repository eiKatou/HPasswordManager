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
    const newMasterPassword = MasterPassword.create(inputMasterPassword);
    const config = new Config(newMasterPassword.getHash(), newMasterPassword.salt);
    ConfigRepository.save(config);
  });
  return;
}

// マスターパスワードの入力と生成
const inputMasterPassword = MasterPasswordView.readMasterPassword();
const masterPassword = new MasterPassword(inputMasterPassword, config.masterPasswordSalt);
if (!masterPassword.validate(config.masterPasswordHash)) {
  MasterPasswordView.showInvalidMasterPassword();
  return;
}

// Viewの生成
const itemView = createItemView();
const commandView = createCommandView(itemView);

// ユーザからの指示を受け付ける
commandView.readCommand();


// ------------
//   function
// ------------
/**
 * ItemViewを生成します
 */
function createItemView() {
  const passwordAction = (item) => {
    ClipboardUtil.copy(item.getPassword(masterPassword));
  };
  return new ItemView(passwordAction);
}

/**
 * ItemViewを生成します
 * @param {ItemView} itemView 
 */
function createCommandView(itemView) {
  // ユーザからの指示による操作（アイテムを追加する時の処理）
  const addAction = (name, siteAddress, id, password) => {
    const item = Item.create(name, siteAddress, id, password, masterPassword);
    const items = ItemRepository.load();
    items.push(item);
    ItemRepository.save(items);
  };
  // ユーザからの指示による操作（アイテムを検索する時の処理）
  const searchAction = (searchWord) => {
    const items = ItemRepository.load();
    return items.filter((item) => {
      return item.isSubjectToSearch(searchWord);
    });
  };
  return new CommandView(addAction, searchAction, itemView);
}
