const readlineSync = require('readline-sync');

class CommandView {
  /**
   * コンストラクタ
   * @param {function(String, String, String, String)} addAction
   * @param {function(String)} searchAction
   * @param {ItemView} itemView
   */
  constructor(addAction, searchAction, itemView) {
    this.addAction = addAction;
    this.searchAction = searchAction;
    this.itemView = itemView
  }

  /**
   * ユーザからのコマンド入力を受け付けます
   */
  readCommand() {
    for (; ;) {
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
        this.addAction(name, siteAddress, id, password);
      } else if (command == 's' || command == 'search') {
        const searchWord = readlineSync.question(' search: ');
        let foundItems = this.searchAction(searchWord);
        if (foundItems.length == 0) {
          this.showItemNotFound();
          continue;
        }
        if (foundItems.length > 1) {
          this.showManyItemsFound(foundItems);
          continue;
        }
        // アイテムが見つかったので、アイテムに対する操作を受け付ける
        this.itemView.readCommand(foundItems[0]);
      }
    }
  }

  /**
   * アイテムが見つからなかった時の表示
   */
  showItemNotFound() {
    console.log(' Item not found.');
  }

  /**
   * 複数アイテムが見つかった時の表示
   * @param {Item[]} items 
   */
  showManyItemsFound(items) {
    console.log(items.length + ' items.');
    items.forEach((item) => {
      console.log('name:' + item.name + ', site:' + item.site);
    });
  }
}
module.exports = CommandView;