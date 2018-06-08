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
}
module.exports = MasterPasswordView;