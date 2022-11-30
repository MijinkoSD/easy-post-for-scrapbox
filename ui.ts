/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

import { Scrapbox } from "https://raw.githubusercontent.com/scrapbox-jp/types/0.3.6/userscript.ts";
declare const scrapbox: Scrapbox;

import { NoMatchSelectorError } from "./exception.ts";
import { postText } from "./post.ts";
import { DEFAULT_FORM_ID } from "./setting.ts";

/**
 * 投稿フォームを描画します。
 * @param {string} [parentDOMSelector="app row-flex"] UIの親となるDOMを指定する際に使用するセレクターを指定します。
 * @param {string} [formId=DEFAULT_FORM_ID] 投稿フォームのDOMに設定するID属性の値。
 */
export function renderPostForm(
  postToProjectName = scrapbox.Project.name,
  postToPageTitle = scrapbox.Page.title,
  formId = DEFAULT_FORM_ID,
) {
  const parent = document.querySelector(".app .row-flex");
  if (parent === null) throw new NoMatchSelectorError(".app .row-flex");
  const root = document.createElement("div");
  root.id = formId;
  const textarea = document.createElement("textarea");
  const sendButton = document.createElement("button");
  sendButton.textContent = "送信";
  sendButton.onclick = async () => {
    if (postToPageTitle === null) return;
    textarea.disabled = true;
    sendButton.disabled = true;
    await postText(
      {
        text: [textarea.value],
        title: dateToString(Date.now()),
      },
      postToProjectName,
      postToPageTitle,
    );
    textarea.disabled = false;
    sendButton.disabled = false;
    textarea.value = "";
  };
  root.append(textarea, sendButton);
  parent.prepend(root);
  const parentsUnderNodes = parent.children;
  for (const node of parentsUnderNodes) {
    // .col-page-sideの順番を先頭に持ってくる
    if (node.className == "col-page-side") {
      parent.prepend(node);
      break;
    }
  }
  textarea.focus();
}

/**
 * 投稿フォームを削除します。
 */
export function removePostForm(
  formId = DEFAULT_FORM_ID,
) {
  const form = document.querySelector("#" + formId);
  if (form === null) return;
  form.remove();
}

/**
 * CSSを適用します。
 */
export function enableCSS(cssSrc: string) {
  const existLinks = document.head.getElementsByTagName("link");
  for (const el of existLinks) {
    if (el.getAttribute("href") == cssSrc) {
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
export function disableCSS(cssSrc: string) {
  const existLinks = document.head.getElementsByTagName("link");
  for (const i in existLinks) {
    if (existLinks[i].getAttribute("href") == cssSrc) {
      existLinks[i].remove();
    }
  }
}

/**
 * unixtime（またはDateオブジェクト）を文字列に変換します。 \
 * 形式は`YYYY-MM-DD HH:mm:ss`です。
 * @param {Date | number} date Dateオブジェクトか、ミリ秒単位のUnixTimeを表す数値。
 */
function dateToString(
  date: Date | number = new Date(Date.now()),
): string {
  const dateObj: Date = (() => {
    if (typeof date == "number") {
      return new Date(date);
    } else {
      return date;
    }
  })();
  const d = {
    year: zeroPadding(dateObj.getFullYear(), 4),
    month: zeroPadding(dateObj.getMonth(), 2),
    day: zeroPadding(dateObj.getDay(), 2),
    hour: zeroPadding(dateObj.getHours(), 2),
    minute: zeroPadding(dateObj.getMinutes(), 2),
    second: zeroPadding(dateObj.getSeconds(), 2),
  };
  return `${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}:${d.second}`;
}

/**
 * 0埋めを行います。 \
 * valueの値の桁数よりも小さいdigitを指定すると、頭の桁から削れていくので注意してください。
 */
function zeroPadding(value: number, digit: number) {
  const zeros = "0".repeat(digit);
  return (zeros + value).slice(-digit);
}
