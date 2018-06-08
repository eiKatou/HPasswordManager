const readlineSync = require('readline-sync');

class ItemView {
  /**
   * コンストラクタ
   * @param {function(String)} passwordAction 
   */
  constructor(passwordAction) {
    this.passwordAction = passwordAction;
  }

  /**
   * ユーザからのコマンド入力を受け付けます
   * @param {Item} item
   */
  readCommand(item) {
    for(;;) {
      let command = readlineSync.question(item.name + ' command: ');
      if (command == 'q' || command == 'quit') {
        return;
      } else if (command == 's' || command == 'show') {
        console.log('name:' + item.name + ', site:' + item.site);
      } else if (command == 'i' || command == 'id') {
        console.log(item.id);
      } else if (command == 'p' || command == 'password') {
        this.passwordAction(item);
        console.log('Copied to clipboard.');
      }
    }
  }
}
module.exports = ItemView;