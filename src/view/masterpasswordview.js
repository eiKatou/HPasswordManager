const readlineSync = require('readline-sync');

class MasterPasswordView {
  /**
   * コンストラクタ
   * @param {function(String)} saveMasterPasswordAction
   */
  constructor(saveMasterPasswordAction) {
    this.saveMasterPasswordAction = saveMasterPasswordAction;
  }

  /**
   * パスワードの初期設定時の表示
   */
  settingInitPassword() {
    let inputNewMasterPassword = readlineSync.question(' new master password: ', {
      hideEchoBack: true
    });
    this.saveMasterPasswordAction(inputNewMasterPassword);
    console.log('Success. Save your master password. Restart this application.');
  }

  /**
   * マスターパスワードの入力を読み取り
   * @returns {String} masterPasswordClearText
   */
  readMasterPassword() {
    return readlineSync.question(' master password: ', {
      hideEchoBack: true
    });
  }

  /**
   * マスターパスワードが間違っていた時のエラー表示
   */
  showInvalidMasterPassword() {
    console.log('Error. Invalid password.');
  }

}
module.exports = MasterPasswordView;