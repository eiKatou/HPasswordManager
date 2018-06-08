const readlineSync = require('readline-sync');

class MasterPasswordView {
  /**
   * パスワードの初期設定時の表示
   * @param {function(String)} saveMasterPasswordAction 
   */
  static settingInitPassword(saveMasterPasswordAction) {
    let inputNewMasterPassword = readlineSync.question(' new master password: ', {
      hideEchoBack: true
    });
    saveMasterPasswordAction(inputNewMasterPassword);
    console.log('Success. Save your master password. Restart this application.');
  }

  /**
   * マスターパスワードの入力を読み取り
   * @returns {String} masterPasswordClearText
   */
  static readMasterPassword() {
    return readlineSync.question(' master password: ', {
      hideEchoBack: true
    });
  }

  /**
   * マスターパスワードが間違っていた時のエラー表示
   */
  static showInvalidMasterPassword() {
    console.log('Error. Invalid password.');
  }

}
module.exports = MasterPasswordView;