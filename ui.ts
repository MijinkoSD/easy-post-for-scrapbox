/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>
/// <reference lib="dom"/>

import { NoMatchSelectorError } from "./exception.ts";
import { DEFAULT_FORM_ID } from "./setting.ts";

/**
 * 投稿フォームを描画します。
 * @param {string} [parentDOMSelector="app row-flex"] UIの親となるDOMを指定する際に使用するセレクターを指定します。
 * @param {string} [formId=DEFAULT_FORM_ID] 投稿フォームのDOMに設定するID属性の値。
 */
export function renderPostForm(
  parentDOMSelector = ".app .row-flex",
  formId = DEFAULT_FORM_ID,
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

/**
 * CSSを適用します。
 */
export function enableCSS(cssSrc: string) {
  const existLinks = document.head.getElementsByTagName("link");
  for (const i in existLinks) {
    if (existLinks[i].getAttribute("href") == cssSrc) {
      return;
    }
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssSrc;
  document.head.appendChild(link);
}

/**
 * CSSを無効化します。
 */
export function removeCSS(cssSrc: string) {
  const existLinks = document.head.getElementsByTagName("link");
  for (const i in existLinks) {
    if (existLinks[i].getAttribute("href") == cssSrc) {
      existLinks[i].remove();
    }
  }
}
