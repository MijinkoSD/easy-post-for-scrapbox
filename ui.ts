/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>
/// <reference lib="dom"/>

import { NoMatchSelectorError } from "./exception.ts";

/**
 * 投稿フォームを描画します。
 * @param {string} [parentDOMSelector="app row-flex"] UIの親となるDOMを指定する際に使用するセレクターを指定します。
 * @param {string} [formId="easy-post-for-scrapbox"] 投稿フォームのDOMに設定するID属性の値。
 */
export function renderPostForm(
  parentDOMSelector = ".app .row-flex",
  formId = "easy-post-for-scrapbox",
) {
  const parent = document.querySelector(parentDOMSelector);
  if (parent === null) throw new NoMatchSelectorError(parentDOMSelector);
  const root = document.createElement("div");
  root.id = formId;
  const textarea = document.createElement("textarea");
  const sendButton = document.createElement("button");
  root.append(textarea, sendButton);
  parent.appendChild(root);
}
