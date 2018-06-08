const readlineSync = require('readline-sync');

class CommandView {
  /**
   * ユーザからのコマンド入力を受け付けます
   * @param {function(String, String, String, String)} addAction
   * @param {function(String)} searchAction
   */
  static readCommand(addAction, searchAction) {
    for(;;) {
      console.log();
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
        addAction(name, siteAddress, id, password);
      } else if (command == 's' || command == 'search') {
        const searchWord = readlineSync.question(' search: ');
        searchAction(searchWord);
      }
    }
  }

  /**
   * アイテムが見つからなかった時の表示
   */
  static showItemNotFound() {
    console.log(' Item not found.');
  }

  /**
   * 複数アイテムが見つかった時の表示
   * @param {Item[]} items 
   */
  static showManyItemsFound(items) {
    console.log(items.length + ' items.');
    items.forEach((item) => {
      console.log('name:' + item.name + ', site:' + item.site);
    });
  }
}
module.exports = CommandView;