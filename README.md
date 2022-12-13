# Scrapbox用の簡易投稿フォーム
UserScriptで動作する簡易投稿フォームを表示します。

真面目に書く気力がないので使い方の説明などは不十分です。 \
もし需要があれば、そのうちちゃんと書くかもしれません。

## 使い方の例
以下の例では、投稿フォームを描画してメッセージを送信できるようにします。 \
- `v0.2.0`のスクリプトを使用しています。
- 書いた後は`deno bundle`コマンドを使用してコンパイルしてください。
```ts
/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>

import { Scrapbox } from "https://raw.githubusercontent.com/scrapbox-jp/types/0.3.6/userscript.ts";
declare const scrapbox: Scrapbox;

import {
  connectWebSocket,
  disableCSS,
  enableCSS,
  removePostForm,
  renderPostForm,
} from "https://raw.githubusercontent.com/MijinkoSD/easy-post-for-scrapbox/v0.2.0/mod.ts";

// ------------
//     設定
// ------------
const CSSPath =
  "https://raw.githubusercontent.com/MijinkoSD/easy-post-for-scrapbox/v0.2.0/ui.css";
/** 送信先のプロジェクト名 */
const sendToProjectName = "";
/** 送信先のページ名 */
const sendToPageTitle = "";
/** 投稿フォームを描画したいページがあるプロジェクトの名前 */
const formRenderProjectName = "";
/** 投稿フォームを描画したいページの名前 */
const formRenderPageTitle = "";

// 設定ここまで

function render() {
  enableCSS(CSSPath);
  renderPostForm(sendToProjectName, sendToPageTitle);
}

function remove() {
  removePostForm();
  disableCSS(CSSPath);
}

function update() {
  if (
    scrapbox.Project.name == formRenderProjectName &&
    scrapbox.Page.title == formRenderPageTitle
  ) {
    render();
  } else {
    remove();
  }
}

connectWebSocket();
update();
scrapbox.on("page:changed", update);
```