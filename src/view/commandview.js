const readlineSync = require('readline-sync');

class CommandView {
  /**
   * ユーザからのコマンド入力を受け付けます
   * @param {function(String, String, String, String)} addCallback 
   * @param {function(String)} searchCallback 
   */
  static readCommand(addCallback, searchCallback) {
    for(;;) {
      const command = readlineSync.question('command: ');
      if (command == 'q' || command == 'quit') {
        break;
      } else if (command == 'a' || command == 'add') {
        const name = readlineSync.question(' Item name:');
        const siteAddress = readlineSync.question(' Site address:');
        const id = readlineSync.question(' Id:');
        const password = readlineSync.question(' Password:', {
          hideEchoBack: true
        });
        addCallback(name, siteAddress, id, password);
      } else if (command == 's' || command == 'search') {
        const searchWord = readlineSync.question(' search: ');
        searchCallback(searchWord);
      }
    }
  }
}
module.exports = CommandView;