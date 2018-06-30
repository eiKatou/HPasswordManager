#!/usr/bin/env node

// domain
const Item = require('./domain/Item');
const MasterPassword = require('./domain/MasterPassword');
// repository
const sessionStore = require('./repository/sessionstore');
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

// Viewの生成
const itemView = createItemView();
const commandView = createCommandView(itemView);
const masterPasswordView = createMasterPasswordView();

// 設定ファイルの読み込み
let config = ConfigRepository.load();
if (config == null) {
  // マスターパスワードの初期設定
  masterPasswordView.settingInitPassword();
  return;
}

// マスターパスワードの入力と生成
const inputMasterPassword = masterPasswordView.readMasterPassword();
const masterPassword = new MasterPassword(inputMasterPassword, config.masterPasswordSalt);
if (!masterPassword.validate(config.masterPasswordHash)) {
  masterPasswordView.showInvalidMasterPassword();
  return;
}
sessionStore.add("masterPassword", masterPassword);

// ユーザからの指示を受け付ける
commandView.readCommand();


// ------------
//   function
// ------------
/**
 * MasterpasswordViewを生成します
 */
function createMasterPasswordView() {
  const savePasswordAction = (inputMasterPassword) => {
    const newMasterPassword = MasterPassword.create(inputMasterPassword);
    const config = new Config(newMasterPassword.getHash(), newMasterPassword.salt);
    ConfigRepository.save(config);
  }
  return new MasterPasswordView(savePasswordAction);
}

/**
 * ItemViewを生成します
 */
function createItemView() {
  const passwordAction = (item) => {
    ClipboardUtil.copy(item.getPassword(sessionStore.get("masterPassword")));
  };
  return new ItemView(passwordAction);
}

/**
 * CommandViewを生成します
 * @param {ItemView} itemView 
 */
function createCommandView(itemView) {
  // ユーザからの指示による操作（アイテムを追加する時の処理）
  const addAction = (name, siteAddress, id, password) => {
    const item = Item.create(name, siteAddress, id, password, sessionStore.get("masterPassword"));
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
