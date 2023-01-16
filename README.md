# Scrapbox用の簡易投稿フォーム
UserScriptで動作する簡易投稿フォームを表示します。

真面目に書く気力がないので使い方の説明などは不十分です。 \
もし需要があれば、そのうちちゃんと書くかもしれません。

## 使い方の例
以下の例では、投稿フォームを描画してメッセージを送信できるようにします。 \
- `v0.3.0`のスクリプトを使用しています。
- 書いた後は`deno bundle`コマンドを使用してコンパイルしてください。
```ts
/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>

import { Scrapbox } from "https://raw.githubusercontent.com/scrapbox-jp/types/0.3.6/userscript.ts";
declare const scrapbox: Scrapbox;

import {
  connectWebSocket,
  removePostForm,
  renderPostForm,
} from "https://raw.githubusercontent.com/MijinkoSD/easy-post-for-scrapbox/v0.3.0/mod.ts";

// ------------
//     設定
// ------------
/** 送信先のプロジェクト名 */
const sendToProjectName = "";
/** 送信先のページ名 */
const sendToPageTitle = "";
/** 投稿フォームを描画したいページがあるプロジェクトの名前 */
const formRenderProjectName = "";
/** 投稿フォームを描画したいページの名前 */
const formRenderPageTitle = "";

// 設定ここまで

function update() {
  if (
    scrapbox.Project.name == formRenderProjectName &&
    scrapbox.Page.title == formRenderPageTitle
  ) {
    renderPostForm(sendToProjectName, sendToPageTitle);
  } else {
    removePostForm();
  }
}

connectWebSocket();
update();
scrapbox.on("page:changed", update);
```

## スタイル(CSS)を設定する
`renderPostForm()`の第3引数(`options`)の中に`cssStyle`を設定します。 \
[MijinkoSD/array2cssText.ts](https://github.com/MijinkoSD/array2cssText.ts)の[Style型](https://doc.deno.land/https://raw.githubusercontent.com/MijinkoSD/array2cssText.ts/v1.0.0/array2cssText.ts/~/Style)の値を設定してください。

### 例
```ts
// 省略

import { Style } from "https://raw.githubusercontent.com/MijinkoSD/array2cssText.ts/v1.0.0/array2cssText.ts";

// 省略

const style = {
  "div.col-page": {
    "display": "none",
  },
  "#easy-post-for-scrapbox": {
    "padding": "5px",
    "border": "1px solid black",
    "border-radius": "5px",
  },
};

renderPostForm(sendToProjectName, sendToPageTitle, { cssStyle: style });

// 省略
```

`cssStyle`を設定すると、デフォルトのスタイルは無効化されるので注意して下さい。
