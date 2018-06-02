# HPasswordManager
パスワード管理ソフト

# 開発時のメモ
```bash
ln -s ~/.hpassword.config hpassword.config
ln -s ~/.hpassword_data hpassword_data
```

```bash
rm ~/.hpassword.config
rm ~/.hpassword_data
```

# TODO
- マスターパスワードの管理に、saltとHMACを使う
- パスワード管理にsaltを使う
- アイテムを削除できるようにする
- EsLintを設定
- 表示関係の処理は別クラスにする