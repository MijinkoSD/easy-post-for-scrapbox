/// <reference no-default-lib="true"/>
/// <reference lib="es2022"/>

import {
  Line,
  makeSocket,
  patch,
  Socket,
} from "./deps/scrapbox-userscript-std.ts";

/** 前回使用したSocket（未使用の場合はundefined） */
let beforeSocket: Socket | undefined = undefined;

export interface TextData {
  text: string[];
  /** Dateオブジェクト、またはミリ秒単位のUnixTime */
  title?: string;
}

export async function postText(
  addText: TextData,
  projectName: string,
  pageTitle: string,
  socket?: Socket,
) {
  const title = (addText.title === undefined ? "" : addText.title);
  if (!addText.text.some((t) => !/^\s*$/.test(t))) {
    // 空白しか無かった場合は送信をキャンセルする
    // socketの更新も行わない
    return;
  }
  const addTextStrings: string[] = [
    ">" + title,
  ];
  for (const text of addText.text) {
    for (const lineText of text.split(/\n/g)) {
      addTextStrings.push(lineText.replace(/^>*(.*)/, "$1"));
    }
  }
  addTextStrings.push(""); // 空行を挿入する

  const updateSocket: Socket = await connectWebSocket(socket);

  const update = (lines: Line[]) => {
    const texts: string[] = [lines[0].text, ...addTextStrings];
    for (const line of lines.slice(1)) {
      texts.push(line.text);
    }
    return texts;
  };
  patch(
    projectName,
    pageTitle,
    update,
    {
      socket: updateSocket,
    },
  );
}

/**
 * WebSocketの接続を開始します。 \
 * 接続以降は自動的にそのソケットを使用します。
 *
 * @param {Socket} [socket] 使用するsocket（指定しない場合は自動的に新しいsocketで接続を開始します）
 */
export async function connectWebSocket(socket?: Socket): Promise<Socket> {
  if (socket !== undefined) {
    beforeSocket = socket;
  } else if (beforeSocket === undefined) {
    beforeSocket = await makeSocket();
  }
  return beforeSocket;
}
