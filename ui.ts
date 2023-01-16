/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>
/// <reference lib="dom"/>
/// <reference lib="dom.iterable"/>

import { scrapbox } from "./deps/scrapbox.ts";
import { Style as CSSStyle, toCSSText } from "./deps/array2cssText.ts";

import { NoMatchSelectorError } from "./exception.ts";
import { postText } from "./post.ts";
import { DEFAULT_FORM_ID } from "./setting.ts";
import { rawStyle } from "./style.ts";

export interface RenderPostFormOpions {
  /** 投稿フォームのDOMに設定するID属性の値 */
  formId?: string;
  /** CSS形式のスタイル */
  cssStyle?: CSSStyle;
}

/** renderPostForm()のoptions引数のデフォルト値 */
const defaultRenderPostFormOpions: Required<RenderPostFormOpions> = {
  formId: DEFAULT_FORM_ID,
  cssStyle: rawStyle,
};

/**
 * 投稿フォームを描画します。
 * @param {string} [postToProjectName=scrapbox.Project.name] 描画先のプロジェクト名
 * @param {string} [postToPageTitle=scrapbox.Page.title] 描画先のページタイトル
 * @param {RenderPostFormOpions} [options=defaultRenderPostFormOpions] その他のオプション
 *
 *   元々の第3引数は`formId`だったため`options`にはstring型の値も設定できるようになっていますが、
 *   あくまで互換性の為に残されている機能なので、string型の値を渡すこと自体は**非推奨**です。 \
 *   この互換機能は将来のメジャーアップデートにて削除されます。
 */
export function renderPostForm(
  postToProjectName = scrapbox.Project.name,
  postToPageTitle = scrapbox.Page.title,
  options?: RenderPostFormOpions | string,
) {
  /**
   * 第3引数の互換性を維持するための関数。 \
   * 将来のメジャーアップデートで削除する。
   */
  function getOptions(): Required<RenderPostFormOpions> {
    if (typeof options === "string") {
      return { ...defaultRenderPostFormOpions, formId: options };
    } else if (options?.formId === undefined) {
      return defaultRenderPostFormOpions;
    } else {
      return { ...defaultRenderPostFormOpions, ...options };
    }
  }
  const { formId, cssStyle } = getOptions();

  const parent = document.querySelector(".app .row-flex");
  if (parent === null) throw new NoMatchSelectorError(".app .row-flex");
  const root = document.createElement("div");
  root.id = formId;
  const textarea = document.createElement("textarea");
  const sendButton = document.createElement("button");
  sendButton.textContent = "送信";
  /** 送信ボタンを押した時の挙動 */
  const sendFunction = async () => {
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
  sendButton.onclick = sendFunction;
  /** Ctrl+Enterでも送信できるようにする */
  textarea.addEventListener("keydown", async (e) => {
    if (
      e.key === "Enter" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
    ) await sendFunction();
    textarea.focus();
  });
  const style = document.createElement("style");
  style.textContent = toCSSText(cssStyle);
  root.append(textarea, sendButton, style);
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

/** @deprecated
 * URLを指定してCSSを適用します。 \
 * 現在は不要です。
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

/** @deprecated
 * URLを指定してCSSを無効化します。 \
 * 現在は不要です。
 */
export function disableCSS(cssSrc: string) {
  const existLinks = document.head.getElementsByTagName("link");
  for (const el of existLinks) {
    if (el.getAttribute("href") == cssSrc) {
      el.remove();
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
    month: zeroPadding(dateObj.getMonth() + 1, 2),
    day: zeroPadding(dateObj.getDate(), 2),
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
